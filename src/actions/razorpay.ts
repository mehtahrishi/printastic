"use server";

import Razorpay from "razorpay";
import { db } from "@/lib/db";
import { orders, orderItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import { clearCart } from "./cart";

async function getUserId() {
    const cookieStore = await cookies();
    const userId = cookieStore.get("auth_session")?.value;
    if (!userId) {
        return null;
    }
    return parseInt(userId);
}

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});


export async function createOrder(amount: number) {
    try {
        const options = {
            amount: amount * 100, // Amount in paise
            currency: "INR",
            receipt: `receipt_${randomBytes(16).toString("hex")}`,
        };
        const order = await razorpay.orders.create(options);
        return { success: true, order };
    } catch (error) {
        console.error("Razorpay order creation error:", error);
        return { success: false, error: "Failed to create payment order." };
    }
}

interface OrderData {
    total: number;
    shippingAddress: string;
    paymentMethod: string;
    items: {
        productId: number;
        quantity: number;
        price: number;
        size: string | null;
        color: string | null;
    }[];
}

export async function verifyPayment(
    paymentResponse: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
    },
    orderData: OrderData
) {
    const userId = await getUserId();
    if (!userId) {
        return { success: false, error: "User not authenticated." };
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentResponse;
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const crypto = require("crypto");
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(body.toString())
        .digest("hex");
    
    if (expectedSignature !== razorpay_signature) {
        return { success: false, error: "Invalid payment signature." };
    }
    
    // Signature is valid, now save the order to the database
    try {
        // Use a transaction to ensure all or nothing
        await db.transaction(async (tx) => {
            const [newOrder] = await tx.insert(orders).values({
                userId: userId,
                total: orderData.total.toString(),
                status: "Processing",
                shippingAddress: orderData.shippingAddress,
                paymentMethod: orderData.paymentMethod,
            });

            const orderId = newOrder.insertId;

            if (!orderId) {
                throw new Error("Failed to create order.");
            }

            const newOrderItems = orderData.items.map(item => ({
                orderId: orderId,
                productId: item.productId,
                quantity: item.quantity,
                price: item.price.toString(),
                size: item.size,
                color: item.color,
            }));

            await tx.insert(orderItems).values(newOrderItems);
        });

        // Clear the cart
        await clearCart();
        
        return { success: true };
    } catch (error) {
        console.error("Failed to save order to database:", error);
        return { success: false, error: "Failed to save order." };
    }
}
