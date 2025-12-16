"use server";

import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { cookies } from "next/headers";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export const adminLogin = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { email, password } = validatedFields.data;

    // Strictly check against Environment Variables
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Fail if env vars are not set
    if (!adminEmail || !adminPassword) {
        console.error("Admin credentials are not configured in environment variables.");
        return { error: "Server configuration error." };
    }

    if (email === adminEmail && password === adminPassword) {
        // Create admin session
        const cookieStore = await cookies();
        cookieStore.set("admin_session", "true", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/",
        });

        return { success: "Welcome back, Admin!" };
    }

    return { error: "Invalid credentials!" };
};
