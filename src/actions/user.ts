"use server";

import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

async function getUserId() {
    const cookieStore = await cookies();
    const userId = cookieStore.get("auth_session")?.value;
    if (!userId) {
        return null;
    }
    return parseInt(userId);
}

export async function getUserDetails() {
    try {
        const userId = await getUserId();
        if (!userId) {
            return null;
        }

        const user = await db
            .select({
                name: users.name,
                email: users.email,
                phone: users.phone,
                address: users.address,
                apartment: users.apartment,
                city: users.city,
                postalCode: users.postalCode,
            })
            .from(users)
            .where(eq(users.id, userId))
            .then(res => res[0]);

        return user || null;
    } catch (error) {
        console.error("Get user details error:", error);
        return null;
    }
}
