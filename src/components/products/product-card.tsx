"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { ToastAction } from "@/components/ui/toast";

interface ProductCardProps {
  product: Product;
  user?: { name: string | null } | null;
}

function getFirstImage(images: string[] | string | undefined): string {
  if (!images) return '';
  if (Array.isArray(images)) return images[0] || '';
  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed[0] || '' : '';
    } catch {
      return images.split(',')[0]?.trim() || '';
    }
  }
  return '';
}

export function ProductCard({ product, user }: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const router = useRouter();

  const isWishlisted = isInWishlist(product.id.toString());

  const showAuthToast = () => {
    toast({
      title: "Authentication Required",
      description: "Please log in or create an account to continue.",
      variant: "destructive",
      action: (
        <ToastAction altText="Login" onClick={() => router.push("/login")}>
          Login
        </ToastAction>
      ),
    });
  };

  const handleAddToCart = () => {
    if (!user) {
      showAuthToast();
      return;
    }
    addToCart(product);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleWishlistToggle = () => {
    if (!user) {
      showAuthToast();
      return;
    }
    if (isWishlisted) {
      removeFromWishlist(product.id.toString());
      toast({
        title: "Removed from Wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist(product);
      toast({
        title: "Added to Wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  const price = Number(product.price);
  const originalPrice = product.originalPrice ? Number(product.originalPrice) : null;
  const onSale = originalPrice && originalPrice > price;

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg group">
      <CardHeader className="p-0 relative">
        <Link href={`/products/${product.slug}`} className="block overflow-hidden">
          {(() => {
            const imageUrl = getFirstImage(product.images);
            return imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.name}
                width={600}
                height={800}
                className="w-full h-auto object-cover aspect-[3/4] transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full aspect-[3/4] flex items-center justify-center bg-muted text-muted-foreground text-sm">
                No Image
              </div>
            );
          })()}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-background/50 hover:bg-background/80 rounded-full h-8 w-8"
          onClick={handleWishlistToggle}
        >
          <Heart
            className={cn(
              "h-4 w-4",
              isWishlisted ? "text-red-500 fill-current" : "text-foreground"
            )}
          />
          <span className="sr-only">
            {isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          </span>
        </Button>
        {onSale && (
          <Badge variant="destructive" className="absolute top-2 left-2">Sale</Badge>
        )}
      </CardHeader>
      <CardContent className="p-3 md:p-4 flex flex-col flex-grow">
        <div className="flex-grow">
            <Link href={`/products/${product.slug}`} className="block mb-2">
            <CardTitle className="text-base md:text-lg font-semibold hover:text-primary transition-colors leading-tight">
                {product.name}
            </CardTitle>
            </Link>
            <div className="flex items-baseline gap-2 mt-2">
                <p className="text-lg md:text-xl font-bold text-primary">₹{price.toFixed(2)}</p>
                {onSale && (
                    <p className="text-sm text-muted-foreground line-through">₹{originalPrice.toFixed(2)}</p>
                )}
            </div>
        </div>
        <div className="mt-4">
            <Button onClick={handleAddToCart} size="sm" className="w-full">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to cart
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
