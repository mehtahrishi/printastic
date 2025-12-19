"use server";

import { db } from "@/lib/db";
import { otpAttempts } from "@/db/schema";
import { eq, and, gt, desc } from "drizzle-orm";
import { sendOtpEmail } from "@/lib/mail";
import { cookies } from "next/headers";

export const resendOtp = async () => {
    const cookieStore = await cookies();
    const tempSession = cookieStore.get("temp_otp_session")?.value;

    if (!tempSession) {
        return { error: "No active session found. Please login again." };
    }

    const [email] = tempSession.split("|");

    if (!email) {
        return { error: "Invalid session. Please login again." };
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

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Send OTP
    try {
        await sendOtpEmail(email, otp);
        console.log("--------------------------------");
        console.log(`Resent OTP for ${email}: ${otp}`);
        console.log("--------------------------------");
    } catch (error) {
        console.error("Failed to resend OTP email:", error);
        return { error: "Failed to send verification email. Please try again." };
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

    // Update cookie with new OTP
    const expiresAtTimestamp = expiresAt.getTime();
    const tempPayload = `${email}|${otp}|${expiresAtTimestamp}`;
    
    cookieStore.set("temp_otp_session", tempPayload, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 5 * 60, // 5 minutes in seconds
        path: "/",
    });

    return { success: "New OTP sent!", twoFactor: true };
};
