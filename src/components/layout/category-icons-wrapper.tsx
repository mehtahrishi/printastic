"use client";

import { useState, useEffect } from "react";
import { CategoryIcons, categories } from "@/components/layout/category-icons";
import { CategoryProductCarousel } from "@/components/layout/category-product-carousel";

export function CategoryIconsWrapper() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>("Oversize T-Shirts");

  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedCategory((current) => {
        const currentIndex = categories.findIndex((c) => c.value === current);
        const nextIndex = (currentIndex + 1) % categories.length;
        return categories[nextIndex].value;
      });
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [selectedCategory]); // Restart timer when category changes (auto or manual)

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
  };

  return (
    <>
      <CategoryIcons onCategorySelect={handleCategorySelect} selectedCategory={selectedCategory} />
      <CategoryProductCarousel category={selectedCategory} />
    </>
  );
}
