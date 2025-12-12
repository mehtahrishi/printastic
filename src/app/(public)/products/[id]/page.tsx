"use client";

import { notFound } from "next/navigation";
import { products } from "@/lib/data";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { PrintPreview } from "@/components/products/print-preview";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = products.find((p) => p.id === params.id);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  if (!product) {
    notFound();
  }
  
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
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

  return (
    <div className="container py-8 md:py-12">
        <Breadcrumb className="mb-8">
            <BreadcrumbList>
                <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                <BreadcrumbLink href="/">Products</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                <BreadcrumbPage>{product.name}</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <PrintPreview product={product} />
        </div>
        <div className="flex flex-col">
          <h1 className="text-3xl lg:text-4xl font-bold">{product.name}</h1>
          <p className="text-2xl font-semibold text-primary mt-2">${product.price.toFixed(2)}</p>
          <Separator className="my-6" />
          <p className="text-foreground/80 leading-relaxed">
            {product.description}
          </p>
          <div className="mt-8 flex items-center gap-4">
            <Button size="lg" className="flex-1" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button size="lg" variant="outline" onClick={handleWishlistToggle}>
              <Heart
                 className={cn(
                  "h-5 w-5",
                  isWishlisted ? "text-red-500 fill-current" : "text-foreground"
                )}
              />
               <span className="sr-only">
                {isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              </span>
            </Button>
          </div>
          <div className="mt-8 text-sm text-foreground/60">
              <p>Category: {product.category}</p>
              <p>Product ID: {product.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
