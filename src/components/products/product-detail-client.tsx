
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

// Update type to be loose enough to accept what we pass but strict enough for components
// We might need to cast specifically if types don't match perfectly
interface ProductDetailClientProps {
    product: any; // We'll cast inside or ensure it matches
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { toast } = useToast();

    // Map database ID (number) to string for hooks if necessary, or ensure hooks handle numbers
    // The previous hooks used string IDs largely. Let's make sure we pass a compatible object.
    const cartProduct = {
        ...product,
        id: product.id.toString(), // Ensure ID is string for cart consistency
    };

    const isWishlisted = isInWishlist(cartProduct.id);

    const handleAddToCart = () => {
        addToCart(cartProduct);
        toast({
            title: "Added to Cart",
            description: `${product.name} has been added to your cart.`,
        });
    };

    const handleWishlistToggle = () => {
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
                {/* PrintPreview likely expects a specific shape, we might need to adjust it or the prop */}
                <PrintPreview product={cartProduct} />

                {/* Additional Images Grid? */}
                {product.images && product.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-4">
                        {product.images.map((img: string, idx: number) => (
                            <img key={idx} src={img} alt={`Preview ${idx}`} className="rounded-md border aspect-square object-cover" />
                        ))}
                    </div>
                )}
            </div>
            <div className="flex flex-col">
                <div className="mb-2">
                    {product.isTrending && (
                        <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-full">Trending</span>
                    )}
                    {!product.isVisible && (
                        <span className="bg-yellow-500/10 text-yellow-600 text-xs font-semibold px-2 py-1 rounded-full ml-2">Hidden</span>
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

                {/* Variants: Sizes & Colors */}
                <div className="mt-8 space-y-6">
                    {product.sizes && product.sizes.length > 0 && (
                        <div>
                            <span className="font-semibold mb-2 block">Available Sizes:</span>
                            <div className="flex flex-wrap gap-2">
                                {product.sizes.map((size: string) => (
                                    <div key={size} className="border rounded-md px-3 py-1 text-sm">{size}</div>
                                ))}
                            </div>
                        </div>
                    )}

                    {product.colors && product.colors.length > 0 && (
                        <div>
                            <span className="font-semibold mb-2 block">Available Colors:</span>
                            <div className="flex flex-wrap gap-2">
                                {product.colors.map((color: string) => (
                                    <div key={color} className="border rounded-md px-3 py-1 text-sm">{color}</div>
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
                    <p>Category: {product.category || "Uncategorized"}</p>
                    <p>SKU/Slug: {product.slug}</p>
                </div>
            </div>
        </div>
    );
}
