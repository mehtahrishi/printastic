"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/app/actions/products";
import { Grid3x3, LayoutGrid } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUserDetails } from "@/actions/user";
import type { User } from "@/db/schema";

type GridView = "4x4" | "3x3";

function ProductsPageComponent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") || "All";

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [gridView, setGridView] = useState<GridView>("4x4");
  const [user, setUser] = useState<Awaited<ReturnType<typeof getUserDetails>> | null>(null);

  useEffect(() => {
    async function fetchProductsAndUser() {
      setLoading(true);
      const [fetchedProducts, userDetails] = await Promise.all([
        getProducts(),
        getUserDetails()
      ]);
      
      setProducts(fetchedProducts);
      setUser(userDetails);
      
      const allCategories = new Set(
        fetchedProducts
          .map((p) => p.category)
          .filter((c): c is string => c && c.trim() !== "")
      );
      
      // Ensure specific categories are always present
      ["Oversize T-Shirts", "Regular T-Shirts", "Kids T-Shirts", "Hoodie"].forEach(cat => allCategories.add(cat));

      setCategories(Array.from(allCategories).sort());
      setLoading(false);
    }
    
    fetchProductsAndUser();
  }, []);
  
  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };


  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="border-b">
        <div className="container py-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-primary">
            Our Products
          </h1>
        </div>
      </div>

      {/* Filters and Grid Toggle */}
      <div className="border-b backdrop-blur-sm bg-background/80 sticky top-16 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Category Dropdown - Left */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">Category:</span>
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Products ({products.length})</SelectItem>
                  {categories.map((category) => {
                    const count = products.filter((p) => p.category === category).length;
                    return (
                      <SelectItem key={category} value={category} disabled={count === 0}>
                        {category} ({count})
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Center Text */}
            <div className="flex-grow text-center hidden md:block">
              <p className="text-sm font-medium text-muted-foreground">
                Available {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Grid View Toggle - Right (Desktop Only) */}
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant={gridView === "4x4" ? "default" : "outline"}
                size="sm"
                onClick={() => setGridView("4x4")}
                className="gap-2"
              >
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline"></span>
              </Button>
              <Button
                variant={gridView === "3x3" ? "default" : "outline"}
                size="sm"
                onClick={() => setGridView("3x3")}
                className="gap-2"
              >
                <Grid3x3 className="h-4 w-4" />
                <span className="hidden sm:inline"></span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container py-8">
        {filteredProducts.length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-muted-foreground">
                Showing {filteredProducts.length} product
                {filteredProducts.length !== 1 ? "s" : ""}
                {selectedCategory !== "All" && (
                  <span> in <strong>{selectedCategory}</strong></span>
                )}
              </p>
            </div>
            <div
              className={`grid gap-6 ${
                gridView === "4x4"
                  ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  : "grid-cols-2 md:grid-cols-3"
              }`}
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product as any}
                  user={user}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="bg-card rounded-lg border p-12 inline-block">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                No Products Found
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                {selectedCategory !== "All"
                  ? `No products available in the ${selectedCategory} category.`
                  : "We're working on adding amazing products for you!"}
              </p>
              {selectedCategory !== "All" && (
                <Button onClick={() => handleCategoryChange("All")} size="lg">
                  View All Products
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsPageComponent />
    </Suspense>
  )
}
