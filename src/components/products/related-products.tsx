
"use client";

import { ProductCard } from "@/components/products/product-card";
import type { Product } from "@/lib/types";

interface RelatedProductsProps {
  products: Product[];
  user?: { name: string | null } | null;
}

export function RelatedProducts({ products, user }: RelatedProductsProps) {
  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold tracking-tight mb-8">You might also like</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} user={user} />
        ))}
      </div>
    </section>
  );
}
