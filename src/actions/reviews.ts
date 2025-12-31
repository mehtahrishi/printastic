"use server";

import { db } from "@/lib/db";
import { reviews, users, products } from "@/db/schema";
import { eq, desc, and, avg, count, sql } from "drizzle-orm";
import { cookies } from "next/headers";

export async function addReview(productId: number, rating: number, reviewText: string) {
    const cookieStore = await cookies();
    const userId = cookieStore.get("auth_session")?.value;

    if (!userId) {
        return { success: false, error: "Not authenticated" };
    }

    if (rating < 1 || rating > 5) {
        return { success: false, error: "Rating must be between 1 and 5" };
    }

    if (reviewText.trim().length < 10) {
        return { success: false, error: "Review must be at least 10 characters" };
    }

    try {
        await db.insert(reviews).values({
            productId,
            userId: parseInt(userId),
            rating,
            review: reviewText,
            status: "PENDING",
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to add review:", error);
        return { success: false, error: "Failed to add review" };
    }
}

export async function getProductReviews(productId: number) {
    try {
        const productReviews = await db
            .select({
                id: reviews.id,
                rating: reviews.rating,
                review: reviews.review,
                createdAt: reviews.createdAt,
                userName: users.name,
            })
            .from(reviews)
            .leftJoin(users, eq(reviews.userId, users.id))
            .where(and(
                eq(reviews.productId, productId),
                eq(reviews.status, "APPROVED")
            ))
            .orderBy(desc(reviews.createdAt));

        return productReviews;
    } catch (error) {
        console.error("Failed to fetch reviews:", error);
        return [];
    }
}

export async function getProductRatingStats(productId: number) {
    try {
        const result = await db
            .select({
                avgRating: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`,
                totalReviews: sql<number>`COUNT(${reviews.id})`,
            })
            .from(reviews)
            .where(and(
                eq(reviews.productId, productId),
                eq(reviews.status, "APPROVED")
            ));

        return {
            avgRating: Number(result[0]?.avgRating || 0),
            totalReviews: Number(result[0]?.totalReviews || 0),
        };
    } catch (error) {
        console.error("Failed to fetch rating stats:", error);
        return { avgRating: 0, totalReviews: 0 };
    }
}

export async function getUserReviewForProduct(productId: number) {
    const cookieStore = await cookies();
    const userId = cookieStore.get("auth_session")?.value;

    if (!userId) {
        return null;
    }

    try {
        const userReview = await db
            .select()
            .from(reviews)
            .where(
                and(
                    eq(reviews.productId, productId),
                    eq(reviews.userId, parseInt(userId))
                )
            )
            .limit(1);

        return userReview[0] || null;
    } catch (error) {
        console.error("Failed to fetch user review:", error);
        return null;
    }
}

export async function updateReview(reviewId: number, rating: number, reviewText: string) {
    const cookieStore = await cookies();
    const userId = cookieStore.get("auth_session")?.value;

    if (!userId) {
        return { success: false, error: "Not authenticated" };
    }

    if (rating < 1 || rating > 5) {
        return { success: false, error: "Rating must be between 1 and 5" };
    }

    if (reviewText.trim().length < 10) {
        return { success: false, error: "Review must be at least 10 characters" };
    }

    try {
        await db
            .update(reviews)
            .set({
                rating,
                review: reviewText,
                updatedAt: new Date(),
            })
            .where(
                and(
                    eq(reviews.id, reviewId),
                    eq(reviews.userId, parseInt(userId))
                )
            );

        return { success: true };
    } catch (error) {
        console.error("Failed to update review:", error);
        return { success: false, error: "Failed to update review" };
    }
}

export async function deleteReview(reviewId: number) {
    const cookieStore = await cookies();
    const userId = cookieStore.get("auth_session")?.value;

    if (!userId) {
        return { success: false, error: "Not authenticated" };
    }

    try {
        await db
            .delete(reviews)
            .where(
                and(
                    eq(reviews.id, reviewId),
                    eq(reviews.userId, parseInt(userId))
                )
            );

        return { success: true };
    } catch (error) {
        console.error("Failed to delete review:", error);
        return { success: false, error: "Failed to delete review" };
    }
}

export async function getAllReviews() {
    try {
        const allReviews = await db
            .select({
                id: reviews.id,
                rating: reviews.rating,
                review: reviews.review,
                status: reviews.status,
                createdAt: reviews.createdAt,
                userName: users.name,
                userEmail: users.email,
                productName: products.name,
                productId: products.id,
                productImage: products.images,
            })
            .from(reviews)
            .leftJoin(users, eq(reviews.userId, users.id))
            .leftJoin(products, eq(reviews.productId, products.id))
            .orderBy(desc(reviews.createdAt));

        return allReviews;
    } catch (error) {
        console.error("Failed to fetch all reviews:", error);
        return [];
    }
}

export async function updateReviewStatus(reviewId: number, status: "APPROVED" | "DECLINED" | "PENDING") {
    try {
        await db
            .update(reviews)
            .set({ status: status })
            .where(eq(reviews.id, reviewId));

        return { success: true };
    } catch (error) {
        console.error("Failed to update review status:", error);
        return { success: false, error: "Failed to update review status" };
    }
}
