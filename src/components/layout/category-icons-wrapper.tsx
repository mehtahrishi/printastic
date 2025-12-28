"use client";

import { useState } from "react";
import { CategoryIcons } from "@/components/layout/category-icons";

export function CategoryIconsWrapper() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategorySelect = (category: string | null) => {
    // This state is now managed on the client, you can add filtering logic here if needed
    setSelectedCategory(category);
  };

  return (
    <CategoryIcons onCategorySelect={handleCategorySelect} selectedCategory={selectedCategory} />
  );
}
