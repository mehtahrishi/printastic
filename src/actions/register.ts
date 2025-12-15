"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { RegisterSchema } from "@/schemas";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { email, password, name, phone } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if email already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).then(res => res[0]);

    if (existingUser) {
        return { error: "Email already in use!" };
    }

    await db.insert(users).values({
        name,
        email,
        phone,
        password: hashedPassword,
    });

    return { success: "Account created! Please login." };
};
