
"use server";

import { db } from "@/lib/db";
import { cartItems, products } from "@/db/schema";
import { eq, and, isNull } from "drizzle-orm";
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

export async function addToCart(productId: number, quantity: number = 1, options?: {
    size?: string;
    color?: string;
    gsm?: string;
}) {
    try {
        const userId = await getUserId();
        if (!userId) {
            return { error: "Please login to add items to cart" };
        }

        // Check if product exists
        const product = await db.select().from(products).where(eq(products.id, productId)).then(res => res[0]);
        if (!product) {
            return { error: "Product not found" };
        }

        // Check if item already exists in cart with same size/color/gsm
        const whereConditions = [
            eq(cartItems.userId, userId),
            eq(cartItems.productId, productId),
            options?.size ? eq(cartItems.size, options.size) : isNull(cartItems.size),
            options?.color ? eq(cartItems.color, options.color) : isNull(cartItems.color),
            options?.gsm ? eq(cartItems.gsm, options.gsm) : isNull(cartItems.gsm)
        ];
        
        const existingItem = await db
            .select()
            .from(cartItems)
            .where(and(...whereConditions))
            .then(res => res[0]);

        if (existingItem) {
            // Update quantity
            await db
                .update(cartItems)
                .set({ 
                    quantity: existingItem.quantity + quantity,
                    updatedAt: new Date()
                })
                .where(eq(cartItems.id, existingItem.id));
        } else {
            // Add new item - only store product_id
            await db.insert(cartItems).values({
                userId,
                productId: productId,
                quantity,
                size: options?.size || null,
                color: options?.color || null,
                gsm: options?.gsm || null,
            });
        }

        revalidatePath("/cart");
        return { success: "Added to cart successfully" };
    } catch (error) {
        console.error("Add to cart error:", error);
        return { error: "Failed to add item to cart" };
    }
}

export async function getCartItems() {
    try {
        const userId = await getUserId();
        if (!userId) {
            return [];
        }

        // Join with products table to get fresh data
        const results = await db
            .select({
                cartItem: cartItems,
                product: products,
            })
            .from(cartItems)
            .innerJoin(products, eq(cartItems.productId, products.id))
            .where(eq(cartItems.userId, userId));
        
        // Drizzle returns nested objects, so we need to flatten them
        return results.map(result => ({
            id: result.cartItem.id,
            quantity: result.cartItem.quantity,
            size: result.cartItem.size,
            color: result.cartItem.color,
            gsm: result.cartItem.gsm,
            product: result.product,
        }));

    } catch (error) {
        console.error("Get cart items error:", error);
        return [];
    }
}

export async function updateCartItemQuantity(cartItemId: number, quantity: number) {
    try {
        const userId = await getUserId();
        if (!userId) {
            return { error: "Please login" };
        }

        if (quantity <= 0) {
            return removeCartItem(cartItemId);
        }

        await db
            .update(cartItems)
            .set({ quantity, updatedAt: new Date() })
            .where(
                and(
                    eq(cartItems.id, cartItemId),
                    eq(cartItems.userId, userId)
                )
            );

        revalidatePath("/cart");
        return { success: "Cart updated" };
    } catch (error) {
        console.error("Update cart item error:", error);
        return { error: "Failed to update cart" };
    }
}

export async function removeCartItem(cartItemId: number) {
    try {
        const userId = await getUserId();
        if (!userId) {
            return { error: "Please login" };
        }

        await db
            .delete(cartItems)
            .where(
                and(
                    eq(cartItems.id, cartItemId),
                    eq(cartItems.userId, userId)
                )
            );

        revalidatePath("/cart");
        return { success: "Item removed from cart" };
    } catch (error) {
        console.error("Remove cart item error:", error);
        return { error: "Failed to remove item" };
    }
}

export async function clearCart() {
    try {
        const userId = await getUserId();
        if (!userId) {
            return { error: "Please login" };
        }

        await db.delete(cartItems).where(eq(cartItems.userId, userId));

        revalidatePath("/cart");
        return { success: "Cart cleared" };
    } catch (error) {
        console.error("Clear cart error:", error);
        return { error: "Failed to clear cart" };
    }
}

export async function getCartCount() {
    try {
        const userId = await getUserId();
        if (!userId) {
            return 0;
        }

        const items = await db
            .select()
            .from(cartItems)
            .where(eq(cartItems.userId, userId));

        return items.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
        console.error("Get cart count error:", error);
        return 0;
    }
}
