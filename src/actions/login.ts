
"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { LoginSchema } from "@/schemas";
import { users, otpAttempts } from "@/db/schema";
import { eq, and, gt, desc } from "drizzle-orm";
import { sendOtpEmail } from "@/lib/mail";
import { cookies } from "next/headers";

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const cookieStore = await cookies();
    
    // Explicitly delete any old sessions to prevent reuse or conflicts
    cookieStore.delete("temp_otp_session");
    cookieStore.delete("auth_session");

    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { email, password } = validatedFields.data;

    let existingUser = await db.select().from(users).where(eq(users.email, email)).then(res => res[0]);

    let passwordsMatch = false;

    // 1. Check Environment Variables for Admin Bypass
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (adminEmail && adminPassword && email === adminEmail && password === adminPassword) {
        passwordsMatch = true;

        if (!existingUser) {
            console.log("Admin config detected but user not found in DB. Creating admin user...");
            try {
                await db.insert(users).values({
                    name: "Admin",
                    email: adminEmail,
                    password: "$2b$10$dummyhashforadminuserauthviaenvvariablesonly", // Dummy hash
                    role: "ADMIN",
                });
                existingUser = await db.select().from(users).where(eq(users.email, email)).then(res => res[0]);
            } catch (error) {
                console.error("Failed to create admin user:", error);
                return { error: "Database error during admin login." };
            }
        }
    } else {
        // 2. Standard Database Authentication
        if (!existingUser || !existingUser.password) {
            return { error: "Invalid credentials!" };
        }
        passwordsMatch = await bcrypt.compare(password, existingUser.password);
    }

    if (!passwordsMatch) {
        return { error: "Invalid credentials!" };
    }

    // Check for recent OTP attempts (rate limiting - 30 seconds)
    const thirtySecondsAgo = new Date(Date.now() - 30 * 1000);
    const recentAttempt = await db
        .select()
        .from(otpAttempts)
        .where(
            and(
                eq(otpAttempts.email, email),
                gt(otpAttempts.createdAt, thirtySecondsAgo)
            )
        )
        .orderBy(desc(otpAttempts.createdAt))
        .limit(1)
        .then(res => res[0]);

    if (recentAttempt) {
        const createdAt = recentAttempt.createdAt ?? new Date();
        const secondsLeft = Math.ceil((createdAt.getTime() + 30000 - Date.now()) / 1000);
        return { 
            error: `Please wait ${secondsLeft} seconds before requesting a new OTP.`,
            rateLimited: true,
            secondsLeft 
        };
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Send OTP
    try {
        await sendOtpEmail(email, otp);
        console.log("--------------------------------");
        console.log(`Generated and sent OTP for ${email}: ${otp}`);
        console.log("--------------------------------");
    } catch (error) {
        console.error("Failed to send OTP email:", error);
        return { error: "Failed to send verification email. Please check server configuration." };
    }

    // Store OTP in database for tracking
    try {
        await db.insert(otpAttempts).values({
            email,
            otp,
            expiresAt,
            isUsed: false,
        });
    } catch (error) {
        console.error("Failed to store OTP attempt:", error);
        // Continue even if database insert fails
    }

    // Store OTP and Email in a new temporary HttpOnly cookie
    const expiresAtTimestamp = expiresAt.getTime();
    const tempPayload = `${email}|${otp}|${expiresAtTimestamp}`;
    
    cookieStore.set("temp_otp_session", tempPayload, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 5 * 60, // 5 minutes in seconds
        path: "/",
    });

    return { success: "OTP sent!", twoFactor: true };
};
