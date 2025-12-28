"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface SizeChartProps {
    category?: string;
}

export function SizeChart({ category }: SizeChartProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!category) return null;

    const normalizedCategory = category.toLowerCase();
    let chartSrc = "";

    // Mapping categories to their respective SVG files in public/size-charts/
    if (normalizedCategory.includes("hoodie")) {
        chartSrc = "/size-charts/hoddie.svg";
    } else if (normalizedCategory.includes("oversized")) {
        chartSrc = "/size-charts/over-tees.svg";
    } else if (normalizedCategory.includes("kids")) {
        chartSrc = "/size-charts/kids.svg";
    } else if (normalizedCategory.includes("t-shirt") || normalizedCategory.includes("tee")) {
        chartSrc = "/size-charts/regular.svg";
    }

    if (!chartSrc) {
        return (
            <div className="p-4 text-center text-muted-foreground text-sm">
                Size chart not available for this category.
            </div>
        );
    }

    return (
        <>
            <div 
                className="w-full bg-white rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setIsModalOpen(true)}
            >
                <img
                    src={chartSrc}
                    alt={`${category} Size Chart`}
                    className="w-full h-auto object-contain"
                />
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-6xl w-[95vw] h-auto max-h-[90vh] p-0 gap-0">
                    <VisuallyHidden>
                        <DialogTitle>Size Chart - {category}</DialogTitle>
                    </VisuallyHidden>
                    <div className="relative w-full h-full overflow-auto touch-auto">
                        <img
                            src={chartSrc}
                            alt={`${category} Size Chart`}
                            className="w-full h-auto object-contain"
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
