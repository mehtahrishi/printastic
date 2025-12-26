
"use client";

import { Heart, ShoppingCart, Loader2, ArrowRight, Check, Star, Shield, Truck, Package, ThumbsUp, ChevronDown, ChevronUp } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { SizeChart } from "@/components/products/size-chart";
import { ProductInfoCards } from "@/components/products/product-info-cards";

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
    const [isAdded, setIsAdded] = useState(false);
    const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);

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

        // Prevent double clicks or interaction during animation
        if (isCartPending || isAdded) return;

        startCartTransition(async () => {
            // Run action and minimum timer in parallel to ensure animation is seen
            const [result] = await Promise.all([
                addToCartAction(product.id, 1, {
                    size: selectedSize || undefined,
                    color: selectedColor || undefined,
                }),
                new Promise(resolve => setTimeout(resolve, 800)) // Minimum 800ms animation time
            ]);

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
                setIsAdded(true);
                setTimeout(() => setIsAdded(false), 2000);
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
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-10">
                {/* Product Images */}
                <div className="lg:sticky lg:top-24 lg:self-start">
                    <PrintPreview product={cartProduct} />
                </div>

                {/* Product Info */}
                <div className="flex flex-col space-y-4">
                    {/* Category & Badge */}
                    <div className="flex items-center justify-between gap-2">
                        {product.category && (
                            <Badge variant="secondary" className="text-xs px-2 py-0.5">
                                {product.category}
                            </Badge>
                        )}
                        {onSale && (
                            <Badge variant="destructive" className="text-xs px-2 py-0.5">
                                Sale
                            </Badge>
                        )}
                    </div>

                    {/* Product Name */}
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">
                            {product.name}
                        </h1>

                        {/* Rating placeholder */}
                        <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
                                ))}
                            </div>
                            <span className="text-xs text-muted-foreground">(4.8 · 127 reviews)</span>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 py-1">
                        <span className="text-2xl md:text-3xl font-bold text-primary">
                            ₹{product.price.toFixed(2)}
                        </span>
                        {onSale && (
                            <>
                                <span className="text-lg text-muted-foreground line-through">
                                    ₹{product.originalPrice.toFixed(2)}
                                </span>
                                <Badge variant="destructive" className="text-xs">
                                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                                </Badge>
                            </>
                        )}
                    </div>

                    {/* Size Chart Section */}
                    {product.sizes && product.sizes.length > 0 && (
                        <div className="space-y-2">
                            <Collapsible
                                open={isSizeChartOpen}
                                onOpenChange={setIsSizeChartOpen}
                                className="w-full"
                            >
                                <CollapsibleTrigger asChild>
                                    <div className="flex items-center justify-between w-full py-2 cursor-pointer transition-colors group">
                                        <span className="font-semibold text-sm group-hover:text-primary">Size Chart</span>
                                        {isSizeChartOpen ? (
                                            <ChevronUp className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                        )}
                                    </div>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                                    <div className="px-2 pb-2 pt-1 border rounded-md mt-1 mb-2 bg-muted/10">
                                        <SizeChart category={product.category} />
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        </div>
                    )}

                    {/* Size Selection */}
                    {product.sizes && product.sizes.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="font-semibold text-sm">
                                Size: {selectedSize && <span className="text-primary ml-1">{selectedSize}</span>}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {product.sizes.map((size: string) => (
                                    <Button
                                        key={size}
                                        variant={selectedSize === size ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setSelectedSize(size)}
                                        className={cn(
                                            "min-w-[50px] h-9 text-sm font-medium transition-all hover:border-primary",
                                            selectedSize === size && "ring-2 ring-primary ring-offset-1"
                                        )}
                                    >
                                        {size}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Color Selection */}
                    {product.colors && product.colors.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="font-semibold text-sm">
                                Color: {selectedColor && <span className="text-primary ml-1">{selectedColor}</span>}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {product.colors.map((color: string) => (
                                    <Button
                                        key={color}
                                        variant={selectedColor === color ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setSelectedColor(color)}
                                        className={cn(
                                            "h-9 text-sm font-medium transition-all hover:border-primary",
                                            selectedColor === color && "ring-2 ring-primary ring-offset-1"
                                        )}
                                    >
                                        {color}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}

                    <Separator />

                    {/* Description */}
                    <div>
                        <h3 className="font-semibold text-sm mb-2">Description</h3>
                        <ul className="text-sm text-foreground/70 space-y-1 list-disc pl-4">
                            {product.description?.split(/,|\n/).map((descPart: string, index: number) => {
                                const trimmed = descPart.trim();
                                if (!trimmed) return null;
                                return (
                                    <li key={index} className="leading-relaxed">
                                        {trimmed}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 pt-3">
                        <Button
                            size="default"
                            className={cn(
                                "w-full h-11 text-base font-semibold overflow-hidden relative",
                                (isCartPending || isAdded) && "cursor-default"
                            )}
                            onClick={handleAddToCart}
                            disabled={isAddToCartDisabled}
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {isCartPending ? (
                                    <motion.div
                                        key="moving-cart"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                    >
                                        <motion.div
                                            initial={{ x: 0 }}
                                            animate={{ x: 150, opacity: [1, 1, 0] }}
                                            transition={{ duration: 0.8, ease: "easeInOut" }}
                                        >
                                            <ShoppingCart className="h-5 w-5" />
                                        </motion.div>
                                    </motion.div>
                                ) : isAdded ? (
                                    <motion.div
                                        key="added"
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="flex items-center"
                                    >
                                        <ThumbsUp className="mr-2 h-5 w-5" />
                                        Added to Cart
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="idle"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="flex items-center"
                                    >
                                        <ShoppingCart className="mr-2 h-4 w-4" />
                                        Add to Cart
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Button>

                        <div className="grid grid-cols-2 gap-2">
                            <Button size="default" variant="outline" className="h-10" asChild>
                                <Link href="/cart">
                                    View Cart
                                    <ArrowRight className="ml-2 h-3.5 w-3.5" />
                                </Link>
                            </Button>
                            <Button
                                size="default"
                                variant="outline"
                                className="h-10"
                                onClick={handleWishlistToggle}
                                disabled={isWishlistPending}
                            >
                                {isWishlistPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <>
                                        <Heart
                                            className={cn(
                                                "h-4 w-4 transition-all duration-200 mr-2",
                                                isWishlisted ? "text-red-500 fill-current" : ""
                                            )}
                                        />
                                        {isWishlisted ? "Saved" : "Save"}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    <Separator />

                    {/* Features Cards */}
                    <ProductInfoCards />
                </div>
            </div>

            {relatedProducts.length > 0 && (
                <div className="mt-12 md:mt-16">
                    <Separator className="mb-8" />
                    <RelatedProducts products={relatedProducts} user={user} />
                </div>
            )}
        </>
    );
}
