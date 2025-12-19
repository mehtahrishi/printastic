
"use client";

import { Heart, ShoppingCart, Loader2, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { PrintPreview } from "@/components/products/print-preview";
import type { Product } from "@/lib/types";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ToastAction } from "../ui/toast";
import { addToCart as addToCartAction } from "@/actions/cart";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { RelatedProducts } from "./related-products";

interface ProductDetailClientProps {
    product: any;
    relatedProducts: Product[];
    user?: { name: string | null } | null;
}

export function ProductDetailClient({ product, relatedProducts, user }: ProductDetailClientProps) {
    const [isCartPending, startCartTransition] = useTransition();
    const [isWishlistPending, startWishlistTransition] = useTransition();

    const { addToCart: addToCartLocal } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { toast } = useToast();
    const router = useRouter();

    const [selectedSize, setSelectedSize] = useState<string | null>(product.sizes?.length === 1 ? product.sizes[0] : null);
    const [selectedColor, setSelectedColor] = useState<string | null>(product.colors?.length === 1 ? product.colors[0] : null);

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

        startCartTransition(async () => {
            const result = await addToCartAction(product.id, 1, {
                size: selectedSize || undefined,
                color: selectedColor || undefined,
            });

            if (result.error) {
                toast({
                    title: "Error",
                    description: result.error,
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Added to Cart",
                    description: `${product.name} has been added to your cart.`,
                });
                addToCartLocal(cartProduct);
            }
        });
    };

    const handleWishlistToggle = () => {
        if (!user) {
            showAuthToast();
            return;
        }
        startWishlistTransition(async () => {
            if (isWishlisted) {
                await removeFromWishlist(cartProduct.id);
            } else {
                await addToWishlist(cartProduct);
            }
        });
    };

    const isAddToCartDisabled =
        (product.sizes && product.sizes.length > 0 && !selectedSize) ||
        (product.colors && product.colors.length > 0 && !selectedColor);
    
    const onSale = product.originalPrice && product.originalPrice > product.price;

    return (
        <>
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                <PrintPreview product={cartProduct} />
                
                <div className="flex flex-col">
                    <div className="mb-4">
                        {product.category && (
                            <span className="text-sm font-medium text-primary">{product.category}</span>
                        )}
                    </div>

                    <h1 className="text-3xl lg:text-4xl font-bold">{product.name}</h1>
                    
                    <div className="flex items-baseline gap-3 mt-4">
                        <p className="text-3xl font-bold text-primary">₹{product.price.toFixed(2)}</p>
                        {onSale && (
                            <p className="text-lg text-muted-foreground line-through">₹{product.originalPrice.toFixed(2)}</p>
                        )}
                    </div>

                    <div className="prose prose-sm max-w-none text-foreground/80 dark:prose-invert mt-6">
                        <p className="text-base leading-relaxed">{product.description}</p>
                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-6">
                        {product.sizes && product.sizes.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold mb-3">Size: <span className="text-foreground">{selectedSize}</span></h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.sizes.map((size: string) => (
                                        <Button
                                            key={size}
                                            variant={selectedSize === size ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setSelectedSize(size)}
                                            className="min-w-[40px]"
                                        >
                                            {selectedSize === size && <Check className="w-4 h-4 mr-1 -ml-1" />}
                                            {size}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {product.colors && product.colors.length > 0 && (
                            <div>
                            <h3 className="text-sm font-semibold mb-3">Color: <span className="text-foreground">{selectedColor}</span></h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.colors.map((color: string) => (
                                        <Button
                                            key={color}
                                            variant={selectedColor === color ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setSelectedColor(color)}
                                        >
                                            {selectedColor === color && <Check className="w-4 h-4 mr-1 -ml-1" />}
                                            {color}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-auto pt-8">
                        <div className="flex flex-col gap-2">
                            <Button size="lg" className="w-full" onClick={handleAddToCart} disabled={isCartPending || isAddToCartDisabled}>
                                {isCartPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="mr-2 h-5 w-5" />
                                        Add to Cart
                                    </>
                                )}
                            </Button>
                            <div className="flex items-center gap-2">
                                <Button size="lg" variant="outline" asChild className="flex-1">
                                    <Link href="/cart">
                                        Go to Cart
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" onClick={handleWishlistToggle} className="px-3" disabled={isWishlistPending}>
                                    {isWishlistPending ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                                        <Heart
                                            className={cn(
                                                "h-5 w-5 transition-colors duration-200",
                                                isWishlisted ? "text-red-500 fill-current" : "text-foreground"
                                            )}
                                        />
                                    )}
                                    <span className="sr-only">
                                        {isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                                    </span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {relatedProducts.length > 0 && (
                 <div className="md:col-span-2 mt-16">
                    <Separator />
                    <RelatedProducts products={relatedProducts} user={user} />
                </div>
            )}
        </>
    );
}
