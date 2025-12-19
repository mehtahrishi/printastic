
"use server";

import * as z from "zod";
import { VerifySchema } from "@/schemas";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const verifyOtp = async (values: z.infer<typeof VerifySchema>) => {
    const validatedFields = VerifySchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid code!" };
    }

    const { otp } = validatedFields.data;

    const cookieStore = await cookies();
    const tempSession = cookieStore.get("temp_otp_session")?.value;

    if (!tempSession) {
        return { error: "Session expired. Please login again." };
    }

    const [email, correctOtp, expiresAtStr] = tempSession.split("|");
    const expiresAt = parseInt(expiresAtStr);

    if (Date.now() > expiresAt) {
        cookieStore.delete("temp_otp_session");
        return { error: "Code expired! Please login again." };
    }

    if (otp !== correctOtp) {
        return { error: "Incorrect code!" };
    }

    // OTP is correct!
    // 1. Clear temp cookie
    cookieStore.delete("temp_otp_session");

    // 2. Set real session cookie
    try {
        const existingUser = await db.select().from(users).where(eq(users.email, email)).then(res => res[0]);

        if (!existingUser) {
            return { error: "User not found!" };
        }

        // Create the main session cookie
        cookieStore.set("auth_session", existingUser.id.toString(), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });

        return { success: "Logged in successfully!" };
    } catch (error) {
        console.error("Database error during OTP verification:", error);
        return { error: "Database connection error. Please try again." };
    }
};
