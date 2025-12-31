import { getAllReviews } from "@/actions/reviews";
import { ReviewsClient } from "@/components/admin/reviews-client";

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
    const reviews = await getAllReviews();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <ReviewsClient initialReviews={reviews} />
        </div>
    );
}
