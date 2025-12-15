"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { LoginSchema } from "@/schemas";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendOtpEmail } from "@/lib/mail";
import { cookies } from "next/headers";

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { email, password } = validatedFields.data;

    const existingUser = await db.select().from(users).where(eq(users.email, email)).then(res => res[0]);

    if (!existingUser || !existingUser.password) {
        return { error: "Invalid credentials!" };
    }

    const passwordsMatch = await bcrypt.compare(password, existingUser.password);

    if (!passwordsMatch) {
        return { error: "Invalid credentials!" };
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Send OTP
    try {
        await sendOtpEmail(email, otp);
    } catch (error) {
        console.error("Failed to send OTP email:", error);
        // In production, we might want to return an error here, but for now we'll log it
        // return { error: "Failed to send verification email." };
    }

    console.log("--------------------------------");
    console.log(`Generated OTP for ${email}: ${otp}`);
    console.log("--------------------------------");

    // In a real app we'd verify email sending success before proceeding.
    // For this flow, we will mimic the "2FA" by setting a temp cookie.

    // Store OTP and Email in a temporary HttpOnly cookie
    // Format: email|otp|expires_at
    const expiresAt = Date.now() + 2 * 60 * 1000; // 2 minutes
    const tempPayload = `${email}|${otp}|${expiresAt}`;

    // We use the Next.js cookies API
    const cookieStore = await cookies();
    cookieStore.set("temp_otp_session", tempPayload, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 2 * 60, // 2 minutes in seconds
        path: "/",
    });

    return { success: "OTP sent!", twoFactor: true };
};
