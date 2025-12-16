import { getProducts } from "@/app/actions/products";
import { ProductCard } from "@/components/products/product-card";
import { ProductCarousel } from "@/components/products/product-carousel";

export default async function HomePage() {
  const fetchedProducts = await getProducts(false);

  const products = fetchedProducts.map(p => ({
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

  return (
    <div>
      <section>
        <div className="container">
          <ProductCarousel />
        </div>
      </section>

      <section className="text-center py-16 md:py-24 bg-muted/40">
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

      <section className="py-12 md:py-20 bg-muted/40">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-10">Our Full Collection</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
