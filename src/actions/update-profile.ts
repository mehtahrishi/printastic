"use server";

import * as z from "zod";
import { ProfileSchema } from "@/schemas";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export const updateProfile = async (values: z.infer<typeof ProfileSchema>) => {
    const validatedFields = ProfileSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { name, phone, address, apartment, city, postalCode } = validatedFields.data;

    const cookieStore = await cookies();
    const userId = cookieStore.get("auth_session")?.value;

    if (!userId) {
        return { error: "Unauthorized" };
    }

    try {
        await db.update(users).set({
            name,
            phone,
            address,
            apartment,
            city,
            postalCode,
        }).where(eq(users.id, parseInt(userId)));

        revalidatePath("/account");
        return { success: "Profile updated successfully!" };
    } catch (error) {
        console.error("Profile update error:", error);
        return { error: "Something went wrong!" };
    }
};
