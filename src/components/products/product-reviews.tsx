"use client";

import { useState, useTransition, useEffect } from "react";
import { Star, Loader2, ChevronDown, ChevronUp, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addReview } from "@/actions/reviews";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface Review {
    id: number;
    rating: number | null;
    review: string;
    userName: string | null;
    createdAt: Date | null;
}

interface UserReview {
    id: number;
    rating: number | null;
    review: string;
}

interface ProductReviewsProps {
    productId: number;
    reviews: Review[];
    user?: { name: string | null } | null;
    averageRating: number;
    totalReviews: number;
    userReview?: UserReview | null;
}

export function ProductReviews({
    productId,
    reviews,
    user,
    averageRating,
    totalReviews,
    userReview: initialUserReview
}: ProductReviewsProps) {
    const [rating, setRating] = useState<number | null>(null);
    const [hoverRating, setHoverRating] = useState<number | null>(null);
    const [reviewText, setReviewText] = useState("");
    const [isPending, startTransition] = useTransition();
    const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    // Carousel state
    const [offset, setOffset] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (reviews.length <= 2) return; // Don't auto-scroll if 2 or fewer reviews

        const interval = setInterval(() => {
            setIsTransitioning(true);
            setOffset((prev) => prev + 1);
        }, 3000);

        return () => clearInterval(interval);
    }, [reviews.length]);

    useEffect(() => {
        if (offset === reviews.length) {
            setTimeout(() => {
                setIsTransitioning(false);
                setOffset(0);
            }, 500);
        }
    }, [offset, reviews.length]);

    const handleSubmit = async () => {
        if (!user) {
            toast({
                title: "Please login",
                description: "You need to be logged in to leave a review",
                variant: "destructive"
            });
            return;
        }

        // Modified validation: Allow if rating exists OR text exists (with basic length check if mostly text)
        if (!rating && reviewText.trim().length < 5) {
            toast({
                title: "Invalid review",
                description: "Please provide a star rating or write a review (at least 5 chars).",
                variant: "destructive"
            });
            return;
        }

        startTransition(async () => {
            const result = await addReview(productId, rating, reviewText);

            if (result.success) {
                toast({
                    title: "Review submitted!",
                    description: "Your review is pending approval."
                });
                setReviewText("");
                setRating(null);
                router.refresh();
            } else {
                toast({
                    title: "Error",
                    description: result.error || "Failed to submit review",
                    variant: "destructive"
                });
            }
        });
    };

    return (
        <div className="space-y-8 mt-12 pt-8 border-t">
            {/* Rating Summary */}
            <div>
                <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
                {totalReviews > 0 ? (
                    <div className="flex items-center gap-4">
                        <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={cn(
                                        "w-5 h-5",
                                        star <= Math.round(averageRating)
                                            ? "fill-primary text-primary"
                                            : "fill-gray-300 text-gray-300"
                                    )}
                                />
                            ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                            {averageRating.toFixed(1)} out of 5 stars · {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                        </span>
                    </div>
                ) : (
                    <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
                )}
            </div>

            {/* Write Review */}
            {user && (
                <div className="border rounded-lg bg-muted/20 overflow-hidden">
                    <Collapsible open={isReviewFormOpen} onOpenChange={setIsReviewFormOpen}>
                        <CollapsibleTrigger asChild>
                            <div className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/30 transition-colors">
                                <h3 className="font-semibold">Write a Review</h3>
                                {isReviewFormOpen ? (
                                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                )}
                            </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <div className="px-6 pb-6 space-y-6">
                                <div className="space-y-3">
                                    <label className="text-sm font-medium">Rating (Optional)</label>
                                    <div className="flex flex-wrap items-center gap-3">
                                        {[1, 2, 3, 4, 5].map((starCount) => (
                                            <div
                                                key={starCount}
                                                className={cn(
                                                    "flex items-center gap-0.5 px-3 py-2 rounded-md cursor-pointer transition-all border",
                                                    rating === starCount
                                                        ? "border-primary bg-primary/5 shadow-sm"
                                                        : "border-transparent hover:bg-muted/50 bg-muted/20"
                                                )}
                                                onClick={() => setRating(rating === starCount ? null : starCount)}
                                            >
                                                {Array.from({ length: starCount }).map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className="w-4 h-4 fill-primary text-primary"
                                                    />
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Select rating: 1 to 5 stars.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Your Review (Optional if rated)</label>
                                    <Textarea
                                        placeholder="Share your experience with this product..."
                                        value={reviewText}
                                        onChange={(e) => setReviewText(e.target.value)}
                                        rows={4}
                                        className="resize-none"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Minimum 5 characters if submitting text.
                                    </p>
                                </div>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isPending || (!rating && reviewText.trim().length < 5)}
                                    className="min-w-[120px]"
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        "Submit Review"
                                    )}
                                </Button>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                </div>
            )}

            {/* Reviews Carousel */}
            {reviews.length > 0 && (
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">All Reviews</h3>
                    <div className="relative mx-auto overflow-hidden">
                        <div
                            className={cn(
                                "flex",
                                isTransitioning && reviews.length > 2 && "transition-transform duration-500 ease-in-out"
                            )}
                            style={{
                                transform: reviews.length > 2 ? `translateX(-${offset * (isMobile ? 100 : 100 / 3)}%)` : 'none'
                            }}
                        >
                            {(reviews.length > 2 ? [...reviews, ...reviews] : reviews).map((review, index) => (
                                <div
                                    key={`${review.id}-${index}`}
                                    className="w-full md:w-1/3 flex-shrink-0 px-3 pb-4"
                                >
                                    <div className="bg-card rounded-lg shadow-lg p-6 border border-border h-full flex flex-col">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div
                                                className="text-primary text-2xl flex-shrink-0"
                                                style={{ fontFamily: "var(--font-tan-buster)" }}
                                            >
                                                {(review.userName || "A").charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-base text-foreground">
                                                    {review.userName || "Anonymous"}
                                                </h3>
                                                <div className="flex items-center gap-1 mt-1">
                                                    {review.rating ? Array.from({ length: 5 }).map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={cn(
                                                                "h-3.5 w-3.5",
                                                                i < (review.rating || 0)
                                                                    ? "fill-primary text-primary"
                                                                    : "fill-gray-300 text-gray-300"
                                                            )}
                                                        />
                                                    )) : (
                                                        <span className="text-xs text-muted-foreground italic">No rating</span>
                                                    )}
                                                    <span className="text-xs text-muted-foreground ml-2">
                                                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        }) : 'Just now'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-foreground/80 leading-relaxed italic">
                                            "{review.review || "No written review"}"
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
