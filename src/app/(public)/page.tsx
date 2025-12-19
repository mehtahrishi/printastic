
import { getProducts } from "@/app/actions/products";
import { ProductCarousel } from "@/components/products/product-carousel";
import { ProductGridClient } from "@/components/products/product-grid-client";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

function parseJsonOrString(data: any): string[] {
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') {
        try {
            // First, try to parse it as JSON
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed)) return parsed;
        } catch (e) {
            // If it's not a valid JSON string, treat it as a comma-separated string
            return data.split(',').map(s => s.trim()).filter(Boolean);
        }
    }
    return [];
}

export default async function HomePage() {
  const fetchedProducts = await getProducts();

  const trendingProducts = fetchedProducts
    .filter(p => p.isTrending) // Filter for trending products
    .map(p => ({
      ...p,
      originalPrice: p.originalPrice ?? undefined,
      category: p.category ?? undefined,
      sizes: parseJsonOrString(p.sizes),
      colors: parseJsonOrString(p.colors),
      images: parseJsonOrString(p.images),
      isTrending: p.isTrending ?? undefined,
    }));
  
  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;
  const user = userId ? await db.select({ name: users.name }).from(users).where(eq(users.id, parseInt(userId))).then(res => res[0] || null) : null;

  return (
    <div>
      <section>
        <div className="container">
          <ProductCarousel trendingProducts={trendingProducts} />
        </div>
      </section>

      <section className="text-center py-12 md:py-16">
        <div className="container">
          <h1 className="text-4xl md:text-6xl font-bold text-primary tracking-tight">
            Art That Speaks to You
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            Discover and buy unique, high-quality prints from independent artists to
            perfectly match your space and style.
          </p>
        </div>
      </section>

      <section className="pb-12 md:pb-20">
        <div className="container">
          <ProductGridClient initialProducts={trendingProducts} user={user} />
        </div>
      </section>
    </div>
  );
}
