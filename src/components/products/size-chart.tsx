import React from "react";

interface SizeChartProps {
    category?: string;
}

export function SizeChart({ category }: SizeChartProps) {
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
        <div className="w-full bg-white rounded-lg overflow-hidden">
            <img
                src={chartSrc}
                alt={`${category} Size Chart`}
                className="w-full h-auto object-contain"
            />
        </div>
    );
}
