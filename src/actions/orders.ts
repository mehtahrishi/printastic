
"use server";

import { db } from "@/lib/db";
import { orders, orderItems, products } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { cookies } from "next/headers";

async function getUserId() {
    const cookieStore = await cookies();
    const userId = cookieStore.get("auth_session")?.value;
    if (!userId) {
        return null;
    }
    return parseInt(userId);
}

export async function getOrders() {
    const userId = await getUserId();
    if (!userId) {
        return [];
    }

    try {
        const userOrders = await db.select()
            .from(orders)
            .where(eq(orders.userId, userId))
            .orderBy(desc(orders.createdAt));

        if (userOrders.length === 0) {
            return [];
        }

        const orderIds = userOrders.map(order => order.id);

        const allOrderItems = await db.select({
            orderId: orderItems.orderId,
            quantity: orderItems.quantity,
            price: orderItems.price,
            size: orderItems.size,
            color: orderItems.color,
            product: {
                id: products.id,
                name: products.name,
                slug: products.slug,
                images: products.images,
            }
        })
        .from(orderItems)
        .innerJoin(products, eq(orderItems.productId, products.id))
        .where(eq(orderItems.orderId, userOrders[0].id));


        const ordersWithItems = userOrders.map(order => {
            const items = allOrderItems
                .filter(item => item.orderId === order.id)
                .map(item => ({
                    ...item,
                    product: {
                        ...item.product,
                        images: Array.isArray(item.product.images) 
                            ? item.product.images 
                            : (JSON.parse(item.product.images as any) as string[])
                    }
                }));

            return {
                ...order,
                items,
            };
        });

        return ordersWithItems;

    } catch (error) {
        console.error("Error fetching orders:", error);
        return [];
    }
}
