
"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { LoginSchema } from "@/schemas";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const cookieStore = await cookies();
    
    // Explicitly delete any old sessions to prevent reuse or conflicts
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

    // Create the main session cookie
    try {
        cookieStore.set("auth_session", existingUser.id.toString(), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });

        return { success: "Logged in successfully!" };
    } catch (error) {
        console.error("Failed to create session:", error);
        return { error: "Failed to create session. Please try again." };
    }
};
