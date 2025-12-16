"use client";

import { ProductCard } from "@/components/products/product-card";
import type { Product } from "@/lib/types";

interface ProductGridClientProps {
    initialProducts: Product[];
    user?: { name: string | null } | null;
}

export function ProductGridClient({ initialProducts, user }: ProductGridClientProps) {
    return (
        <div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                {initialProducts.length > 0 ? (
                    initialProducts.map((product) => (
                        <ProductCard key={product.id} product={product} user={user} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-10 text-muted-foreground">
                        No products found.
                    </div>
                )}
            </div>
        </div>
    );
}
