"use server";

import { db } from "@/lib/db";
import { users, type User } from "@/db/schema";
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

export async function getUserDetails(): Promise<(typeof users.$inferSelect) | null> {
    try {
        const userId = await getUserId();
        if (!userId) {
            return null;
        }

        const user = await db
            .select()
            .from(users)
            .where(eq(users.id, userId))
            .then(res => res[0]);

        return user || null;
    } catch (error) {
        console.error("Get user details error:", error);
        return null;
    }
}
