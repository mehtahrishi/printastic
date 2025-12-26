
"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { ForgotPasswordSchema } from "@/schemas";
import { users, passwordResetTokens } from "@/db/schema";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";
import { sendPasswordResetEmail } from "@/lib/mail";

export const requestPasswordReset = async (values: z.infer<typeof ForgotPasswordSchema>) => {
    const validatedFields = ForgotPasswordSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid email!" };
    }

    const { email } = validatedFields.data;

    const existingUser = await db.select().from(users).where(eq(users.email, email)).then(res => res[0]);

    if (!existingUser) {
        // To prevent user enumeration, we don't reveal that the user does not exist.
        // We simply return a success message as if an email was sent.
        return { success: "If an account with this email exists, a password reset link has been sent." };
    }

    // Invalidate any old tokens for this user
    await db.delete(passwordResetTokens).where(eq(passwordResetTokens.email, email));

    // Generate new token
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(new Date().getTime() + 3600 * 1000); // 1 hour from now

    try {
        await db.insert(passwordResetTokens).values({
            email,
            token,
            expiresAt,
        });

        // Send email
        await sendPasswordResetEmail(email, token);

        return { success: "If an account with this email exists, a password reset link has been sent." };
    } catch (error) {
        console.error("Password reset request error:", error);
        // Generic error to avoid exposing server issues
        return { error: "Something went wrong. Please try again later." };
    }
};
