
"use server";

import { db } from "@/lib/db";
import { wishlistItems, products } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

async function getUserId() {
    const cookieStore = await cookies();
    const userId = cookieStore.get("auth_session")?.value;
    if (!userId) {
        return null;
    }
    return parseInt(userId);
}

export async function addToWishlistAction(productId: number) {
    try {
        const userId = await getUserId();
        if (!userId) {
            return { error: "Please login to add items to your wishlist" };
        }

        const existingItem = await db
            .select()
            .from(wishlistItems)
            .where(
                and(
                    eq(wishlistItems.userId, userId),
                    eq(wishlistItems.productId, productId)
                )
            )
            .then(res => res[0]);

        if (existingItem) {
            return { success: "Item is already in your wishlist" };
        }

        await db.insert(wishlistItems).values({
            userId,
            productId,
        });

        revalidatePath("/wishlist");
        return { success: "Added to wishlist successfully" };
    } catch (error) {
        console.error("Add to wishlist error:", error);
        return { error: "Failed to add item to wishlist" };
    }
}

export async function removeFromWishlistAction(productId: number) {
    try {
        const userId = await getUserId();
        if (!userId) {
            return { error: "Please login to modify your wishlist" };
        }

        await db
            .delete(wishlistItems)
            .where(
                and(
                    eq(wishlistItems.userId, userId),
                    eq(wishlistItems.productId, productId)
                )
            );

        revalidatePath("/wishlist");
        return { success: "Item removed from wishlist" };
    } catch (error) {
        console.error("Remove from wishlist error:", error);
        return { error: "Failed to remove item from wishlist" };
    }
}

export async function getWishlistItems() {
    try {
        const userId = await getUserId();
        if (!userId) {
            return [];
        }

        const results = await db
            .select({
                product: products,
            })
            .from(wishlistItems)
            .innerJoin(products, eq(wishlistItems.productId, products.id))
            .where(eq(wishlistItems.userId, userId));
            
        return results.map(result => result.product);

    } catch (error) {
        console.error("Get wishlist items error:", error);
        return [];
    }
}
