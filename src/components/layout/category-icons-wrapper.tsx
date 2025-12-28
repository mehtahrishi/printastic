"use client";

import { useState } from "react";
import { CategoryIcons } from "@/components/layout/category-icons";
import { CategoryProductCarousel } from "@/components/layout/category-product-carousel";

export function CategoryIconsWrapper() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>("Oversize T-Shirts");

  const handleCategorySelect = (category: string | null) => {
    // This state is now managed on the client, you can add filtering logic here if needed
    setSelectedCategory(category);
  };

  return (
    <>
      <CategoryIcons onCategorySelect={handleCategorySelect} selectedCategory={selectedCategory} />
      <CategoryProductCarousel category={selectedCategory} />
    </>
  );
}
