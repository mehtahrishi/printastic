import { getProducts } from "@/app/actions/products";
import { ProductCarousel } from "@/components/products/product-carousel";
import { ProductGridClient } from "@/components/products/product-grid-client";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export default async function HomePage() {
  const fetchedProducts = await getProducts(false);

  const products = fetchedProducts
    .filter(p => p.isTrending) // Filter for trending products
    .map(p => ({
      ...p,
      originalPrice: p.originalPrice ?? undefined,
      category: p.category ?? undefined,
      sizes: p.sizes ?? undefined,
      colors: p.colors ?? undefined,
      images: (() => {
        const imgs = p.images as unknown;
        if (Array.isArray(imgs)) return imgs as string[];
        if (typeof imgs === 'string') {
          try {
            const parsed = JSON.parse(imgs);
            if (Array.isArray(parsed)) return parsed as string[];
          } catch { }
          return (imgs as string).split(',').map((s: string) => s.trim()).filter(Boolean);
        }
        return [];
      })(),
      isTrending: p.isTrending ?? undefined,
      isVisible: p.isVisible ?? undefined,
    }));

  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;
  const user = userId ? await db.select({ name: users.name }).from(users).where(eq(users.id, parseInt(userId))).then(res => res[0] || null) : null;

  return (
    <div>
      <section>
        <div className="container">
          <ProductCarousel trendingProducts={products} />
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
          <ProductGridClient initialProducts={products} user={user} />
        </div>
      </section>
    </div>
  );
}
