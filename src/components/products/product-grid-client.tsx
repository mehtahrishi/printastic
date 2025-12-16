"use client";

import { useState } from "react";
import { ProductCard } from "@/components/products/product-card";
import { CategoryFilter } from "@/components/products/category-filter";
import type { Product } from "@/lib/types";

interface ProductGridClientProps {
    initialProducts: Product[];
}

export function ProductGridClient({ initialProducts }: ProductGridClientProps) {
    const [products, setProducts] = useState(initialProducts);

    return (
        <div>
            <CategoryFilter products={initialProducts} onFilterChange={setProducts} />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
                {products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-10 text-muted-foreground">
                        No products found in this category.
                    </div>
                )}
            </div>
        </div>
    );
}
