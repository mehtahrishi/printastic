"use client";

import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { PrintPreview } from "@/components/products/print-preview";
import type { Product } from "@/lib/types";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastAction } from "../ui/toast";

interface ProductDetailClientProps {
    product: any;
    user?: { name: string | null } | null;
}

export function ProductDetailClient({ product, user }: ProductDetailClientProps) {
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { toast } = useToast();
    const router = useRouter();

    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);

    const cartProduct = { ...product, id: product.id.toString() };
    const isWishlisted = isInWishlist(cartProduct.id);

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
        addToCart(cartProduct);
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
            removeFromWishlist(cartProduct.id);
            toast({
                title: "Removed from Wishlist",
                description: `${product.name} has been removed from your wishlist.`,
            });
        } else {
            addToWishlist(cartProduct);
            toast({
                title: "Added to Wishlist",
                description: `${product.name} has been added to your wishlist.`,
            });
        }
    };

    return (
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div>
                <PrintPreview product={cartProduct} />
            </div>
            <div className="flex flex-col">
                <div className="mb-2">
                    {product.isTrending && (
                        <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-full">Trending</span>
                    )}
                </div>

                <h1 className="text-3xl lg:text-4xl font-bold">{product.name}</h1>
                <div className="flex items-baseline gap-3 mt-2">
                    <p className="text-2xl font-semibold text-primary">₹{product.price.toFixed(2)}</p>
                    {product.originalPrice && (
                        <p className="text-lg text-muted-foreground line-through">₹{product.originalPrice.toFixed(2)}</p>
                    )}
                </div>

                <Separator className="my-6" />

                <div className="prose prose-sm max-w-none text-foreground/80 dark:prose-invert">
                    <p className="text-base leading-relaxed">{product.description}</p>
                </div>

                <div className="mt-8 space-y-6">
                    {product.sizes && product.sizes.length > 0 && (
                        <div>
                            <span className="font-semibold mb-3 block">Size</span>
                            <div className="flex flex-wrap gap-2">
                                {product.sizes.map((size: string) => (
                                    <Button
                                        key={size}
                                        variant={selectedSize === size ? "default" : "outline"}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}

                    {product.colors && product.colors.length > 0 && (
                        <div>
                            <span className="font-semibold mb-3 block">Color</span>
                            <div className="flex flex-wrap gap-2">
                                {product.colors.map((color: string) => (
                                    <Button
                                        key={color}
                                        variant={selectedColor === color ? "default" : "outline"}
                                        onClick={() => setSelectedColor(color)}
                                    >
                                        {color}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-8 flex items-center gap-4">
                    <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Add to Cart
                    </Button>
                    <Button size="lg" variant="outline" onClick={handleWishlistToggle} className="px-3">
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
                    <p><span className="font-medium">Category:</span> {product.category || "Uncategorized"}</p>
                    <p><span className="font-medium">SKU:</span> {product.slug}</p>
                </div>
            </div>
        </div>
    );
}
