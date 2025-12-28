import { getProducts } from "@/app/actions/products";
import { getUserDetails } from "@/actions/user";
import { ProductCarousel } from "@/components/products/product-carousel";
import { ProductGridClient } from "@/components/products/product-grid-client";
import { CategoryIconsWrapper } from "@/components/layout/category-icons-wrapper";
import { ReviewsCarousel } from "@/components/reviews-carousel";
import type { Product } from "@/lib/types";

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

export default async function HomePage() {
  const allProducts = await getProducts();
  const user = await getUserDetails();

  const trendingProducts = allProducts
    .filter((p) => p.isTrending)
    .sort((a, b) => new Date(b.createdAt as any).getTime() - new Date(a.createdAt as any).getTime())
    .map((p) => ({
      ...p,
      originalPrice: p.originalPrice ?? undefined,
      category: p.category ?? undefined,
      sizes: parseJsonOrString(p.sizes),
      colors: parseJsonOrString(p.colors),
      images: parseJsonOrString(p.images),
      isTrending: p.isTrending ?? undefined,
    }));

  return (
    <div>
      <section>
        <div className="container">
          <ProductCarousel trendingProducts={trendingProducts} />
        </div>
      </section>

      {/* CategoryIcons remains a client component for interactivity */}
      <CategoryIconsWrapper />

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
          <ProductGridClient initialProducts={trendingProducts.slice(0, 8)} user={user} />
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
