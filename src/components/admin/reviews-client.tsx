"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Check, X, Star, MoreHorizontal, Filter } from "lucide-react";
import { updateReviewStatus } from "@/actions/reviews";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

interface Review {
    id: number;
    rating: number;
    review: string;
    status: string;
    createdAt: Date | null;
    userName: string | null;
    userEmail: string | null;
    productName: string | null;
    productId: number | null;
    productImage: any;
}

interface ReviewsClientProps {
    initialReviews: Review[];
}

export function ReviewsClient({ initialReviews }: ReviewsClientProps) {
    const [reviews, setReviews] = useState<Review[]>(initialReviews);
    const { toast } = useToast();
    const [filter, setFilter] = useState("ALL");

    const handleStatusUpdate = async (reviewId: number, newStatus: "APPROVED" | "DECLINED") => {
        try {
            // Optimistic update
            setReviews(prev => prev.map(r =>
                r.id === reviewId ? { ...r, status: newStatus } : r
            ));

            const result = await updateReviewStatus(reviewId, newStatus);

            if (!result.success) {
                // Revert on failure
                setReviews(initialReviews); // simplistic revert, better to use previous state
                toast({
                    title: "Error",
                    description: "Failed to update review status",
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Success",
                    description: `Review ${newStatus.toLowerCase()}`,
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong",
                variant: "destructive",
            });
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "APPROVED": return "bg-green-100 text-green-800 border-green-200";
            case "DECLINED": return "bg-red-100 text-red-800 border-red-200";
            default: return "bg-yellow-100 text-yellow-800 border-yellow-200";
        }
    };

    const filteredReviews = reviews.filter(review => {
        if (filter === "ALL") return true;
        return review.status === filter;
    });

    const parseImages = (images: any) => {
        if (!images) return [];
        if (Array.isArray(images)) return images;
        try {
            return JSON.parse(images);
        } catch {
            return [];
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Reviews</h2>
                    <p className="text-muted-foreground">Manage customer reviews and ratings</p>
                </div>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle>Recent Reviews</CardTitle>
                        <Tabs defaultValue="ALL" onValueChange={setFilter} className="w-[400px]">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="ALL">All</TabsTrigger>
                                <TabsTrigger value="PENDING">Pending</TabsTrigger>
                                <TabsTrigger value="APPROVED">Approved</TabsTrigger>
                                <TabsTrigger value="DECLINED">Declined</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                    <CardDescription>
                        Review and moderate user submitted feedback.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[250px]">Product</TableHead>
                                <TableHead>Review</TableHead>
                                <TableHead className="w-[150px]">User</TableHead>
                                <TableHead className="w-[100px]">Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredReviews.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                        No reviews found matching that filter.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredReviews.map((review) => {
                                    const images = parseImages(review.productImage);
                                    const mainImage = images[0];

                                    return (
                                        <TableRow key={review.id}>
                                            <TableCell>
                                                <div className="flex items-start gap-3">
                                                    {mainImage && (
                                                        <div className="h-12 w-12 rounded-md overflow-hidden relative bg-muted shrink-0">
                                                            <Image
                                                                src={mainImage}
                                                                alt={review.productName || "Product"}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-medium line-clamp-1">{review.productName}</div>
                                                        <div className="text-xs text-muted-foreground">ID: {review.id}</div>
                                                        <div className="flex items-center mt-1">
                                                            {Array.from({ length: 5 }).map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={cn(
                                                                        "h-3 w-3",
                                                                        i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
                                                                    )}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <p className="text-sm line-clamp-2 md:line-clamp-3 font-medium text-foreground/90">
                                                        "{review.review}"
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {review.createdAt ? format(new Date(review.createdAt), "PPP") : "Unknown date"}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-sm">{review.userName || "Anonymous"}</span>
                                                    <span className="text-xs text-muted-foreground">{review.userEmail}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={cn("capitalize font-normal", getStatusColor(review.status))}>
                                                    {review.status.toLowerCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {review.status !== "APPROVED" && (
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                                                            onClick={() => handleStatusUpdate(review.id, "APPROVED")}
                                                            title="Approve"
                                                        >
                                                            <Check className="h-4 w-4" />
                                                            <span className="sr-only">Approve</span>
                                                        </Button>
                                                    )}
                                                    {review.status !== "DECLINED" && (
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                                            onClick={() => handleStatusUpdate(review.id, "DECLINED")}
                                                            title="Decline"
                                                        >
                                                            <X className="h-4 w-4" />
                                                            <span className="sr-only">Decline</span>
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
