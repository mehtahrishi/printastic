"use client";

import Link from "next/link";
import { useWishlist } from "@/hooks/use-wishlist";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/product-card";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";

export default function WishlistPage() {
  const { wishlistItems } = useWishlist();

  return (
    <div className="container py-12 md:py-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Your Wishlist</h1>
      {wishlistItems.length === 0 ? (
        <Card className="text-center py-20">
          <CardContent>
            <Heart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">
              Add your favorite prints to your wishlist to keep track of them.
            </p>
            <Button asChild>
              <Link href="/">Explore Art</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          {wishlistItems.map(({ product }) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
