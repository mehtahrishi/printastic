"use client";

import { useEffect, useState } from "react";
import { ProductCarousel } from "@/components/products/product-carousel";
import { ProductGridClient } from "@/components/products/product-grid-client";
import { CategoryIcons } from "@/components/layout/category-icons";
import { ReviewsCarousel } from "@/components/reviews-carousel";
import type { Product } from "@/lib/types";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>("Oversize T-Shirts");
  const [user, setUser] = useState<{ name: string | null } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch products
        const res = await fetch("/api/products");
        const data = await res.json();
        
        const trendingProducts = data
          .filter((p: any) => p.isTrending)
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map((p: any) => ({
            ...p,
            originalPrice: p.originalPrice ?? undefined,
            category: p.category ?? undefined,
            sizes: parseJsonOrString(p.sizes),
            colors: parseJsonOrString(p.colors),
            images: parseJsonOrString(p.images),
            isTrending: p.isTrending ?? undefined,
          }));
        
        setProducts(trendingProducts);
        setFilteredProducts(trendingProducts);

        // Fetch user info
        const userRes = await fetch("/api/user");
        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setFilteredProducts(products.filter(p => p.category === selectedCategory));
    } else {
      setFilteredProducts(products);
    }
  }, [selectedCategory, products]);

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
  };

  return (
    <div>
      <section>
        <div className="container">
          <ProductCarousel trendingProducts={products} />
        </div>
      </section>

      <CategoryIcons onCategorySelect={handleCategorySelect} selectedCategory={selectedCategory} />

      {selectedCategory && (
        <section className="py-6">
          <div className="container">
            <ProductGridClient initialProducts={filteredProducts} user={user} />
          </div>
        </section>
      )}

      <section className="text-center py-12 md:py-16">
        <div className="container">
          <h1 className="text-4xl md:text-6xl font-bold text-primary tracking-tight">
            Trending Now
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            Discover our most popular designs and best-selling prints
          </p>
        </div>
      </section>

      <section className="pb-12">
        <div className="container">
          {isLoading ? (
            <div className="text-center py-10 text-muted-foreground">Loading products...</div>
          ) : (
            <ProductGridClient initialProducts={products.slice(0, 8)} user={user} />
          )}
          <div className="text-center mt-8">
            <a 
              href="/products" 
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors"
            >
              View All Products
            </a>
          </div>
        </div>
      </section>

      <ReviewsCarousel />
    </div>
  );
}

function parseJsonOrString(data: any): string[] {
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') {
        try {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed)) return parsed;
        } catch (e) {
            return data.split(',').map(s => s.trim()).filter(Boolean);
        }
    }
    return [];
}
