
"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { ResetPasswordSchema } from "@/schemas";
import { users, passwordResetTokens } from "@/db/schema";
import { eq } from "drizzle-orm";

export const resetPassword = async (values: z.infer<typeof ResetPasswordSchema>) => {
    const validatedFields = ResetPasswordSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { password, token } = validatedFields.data;

    const existingToken = await db.select().from(passwordResetTokens).where(eq(passwordResetTokens.token, token)).then(res => res[0]);

    if (!existingToken) {
        return { error: "Invalid or expired token!" };
    }

    const hasExpired = new Date(existingToken.expiresAt) < new Date();

    if (hasExpired) {
        // Clean up expired token
        await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, existingToken.id));
        return { error: "Token has expired!" };
    }

    const existingUser = await db.select().from(users).where(eq(users.email, existingToken.email)).then(res => res[0]);

    if (!existingUser) {
        return { error: "No user found for this token." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await db.update(users)
            .set({ password: hashedPassword })
            .where(eq(users.id, existingUser.id));

        // Invalidate the token after use
        await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, existingToken.id));

        return { success: "Password updated successfully! Please log in." };
    } catch (error) {
        console.error("Reset password error:", error);
        return { error: "Something went wrong!" };
    }
};
