import { products } from "@/lib/data";
import { ProductCard } from "@/components/products/product-card";

export default function HomePage() {
  return (
    <div>
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

      <section className="py-12 md:py-20">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-10">Our Collection</h2>
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
