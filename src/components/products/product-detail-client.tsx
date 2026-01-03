
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
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ToastAction } from "../ui/toast";
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
    averageRating: number;
    totalReviews: number;
}

export function ProductDetailClient({ product, relatedProducts, user, averageRating, totalReviews }: ProductDetailClientProps) {
    const [isWishlistPending, startWishlistTransition] = useTransition();

    const { addToCart, isUpdating: isCartPending } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    // Check if product has GSM pricing (oversize product)
    const hasGsmPricing = product.gsm180Price && product.gsm240Price;
    const gsmOptions = hasGsmPricing ? [
        { value: "180", label: "180 GSM (Standard)", price: Number(product.gsm180Price) },
        { value: "240", label: "240 GSM (Premium)", price: Number(product.gsm240Price) }
    ] : null;

    const [selectedSize, setSelectedSize] = useState<string | null>(
        searchParams.get("size") || (product.sizes?.length === 1 ? product.sizes[0] : null)
    );
    const [selectedGsm, setSelectedGsm] = useState<string | null>(
        searchParams.get("gsm") || (gsmOptions ? "180" : null)
    );
    const [selectedColor, setSelectedColor] = useState<string | null>(
        searchParams.get("color") || (product.colors?.length === 1 ? product.colors[0] : null)
    );
    const [animationState, setAnimationState] = useState<'idle' | 'animating' | 'added'>('idle');
    const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);

    // Calculate current price based on GSM selection
    const currentPrice = hasGsmPricing && selectedGsm
        ? (gsmOptions?.find(g => g.value === selectedGsm)?.price || Number(product.price))
        : Number(product.price);

    const cartProduct = { ...product, id: product.id.toString() };
    const isWishlisted = isInWishlist(cartProduct.id);

    const showAuthToast = () => {
        // Construct the return URL with current selections
        const params = new URLSearchParams();
        if (selectedSize) params.set("size", selectedSize);
        if (selectedColor) params.set("color", selectedColor);
        if (selectedGsm) params.set("gsm", selectedGsm);

        const returnUrl = `${pathname}?${params.toString()}`;
        const loginUrl = `/login?callbackUrl=${encodeURIComponent(returnUrl)}`;

        toast({
            title: "Authentication Required",
            description: "Please log in or create an account to continue.",
            variant: "destructive",
            action: (
                <ToastAction altText="Login" onClick={() => router.push(loginUrl)}>
                    Login
                </ToastAction>
            ),
        });
    };

    const handleAddToCart = async () => {
        if (!user) {
            // Construct the return URL with current selections
            const params = new URLSearchParams();
            if (selectedSize) params.set("size", selectedSize);
            if (selectedColor) params.set("color", selectedColor);
            if (selectedGsm) params.set("gsm", selectedGsm);

            const returnUrl = `${pathname}?${params.toString()}`;
            const loginUrl = `/login?callbackUrl=${encodeURIComponent(returnUrl)}`;

            router.push(loginUrl);
            return;
        }

        if (isCartPending || animationState !== 'idle') return;

        setAnimationState('animating');
        await addToCart(product.id, 1, {
            size: selectedSize || undefined,
            color: selectedColor || undefined,
            gsm: selectedGsm || undefined,
        });

        // The animation sequence is handled by the `onAnimationComplete` prop on the motion component
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
        (hasGsmPricing && !selectedGsm) ||
        (product.colors && product.colors.length > 0 && !selectedColor) ||
        isCartPending;

    const onSale = product.originalPrice && !hasGsmPricing && product.originalPrice > product.price;

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

                        {/* Rating */}
                        {totalReviews > 0 ? (
                            <div className="flex items-center gap-2 mt-2">
                                <div className="flex items-center">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={cn(
                                                "w-3.5 h-3.5",
                                                star <= Math.round(averageRating)
                                                    ? "fill-primary text-primary"
                                                    : "fill-gray-300 text-gray-300"
                                            )}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    ({averageRating.toFixed(1)} · {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs text-muted-foreground">No reviews yet</span>
                            </div>
                        )}
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 py-1">
                        <span className="text-2xl md:text-3xl font-bold text-primary">
                            ₹{currentPrice.toFixed(2)}
                        </span>
                        {onSale && (
                            <>
                                <span className="text-lg text-muted-foreground line-through">
                                    ₹{Number(product.originalPrice).toFixed(2)}
                                </span>
                                <Badge variant="destructive" className="text-xs">
                                    {Math.round((1 - Number(product.price) / Number(product.originalPrice)) * 100)}% OFF
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

                    {/* GSM Selection for Oversize Products */}
                    {hasGsmPricing && gsmOptions && (
                        <div className="space-y-3">
                            <h3 className="font-semibold text-sm">
                                Material: {selectedGsm && <span className="text-primary ml-1">{gsmOptions.find(g => g.value === selectedGsm)?.label}</span>}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {gsmOptions.map((gsm) => (
                                    <Button
                                        key={gsm.value}
                                        variant={selectedGsm === gsm.value ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setSelectedGsm(gsm.value)}
                                        className={cn(
                                            "h-auto py-2 px-4 text-sm font-medium transition-all hover:border-primary flex flex-col items-start",
                                            selectedGsm === gsm.value && "ring-2 ring-primary ring-offset-1"
                                        )}
                                    >
                                        <span className="font-semibold">{gsm.label}</span>
                                        <span className="text-xs opacity-80">₹{gsm.price}</span>
                                    </Button>
                                ))}
                            </div>
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
                                (isCartPending || animationState !== 'idle') && "cursor-default"
                            )}
                            onClick={handleAddToCart}
                            disabled={isAddToCartDisabled || animationState !== 'idle'}
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {animationState === 'idle' && (
                                    <motion.span
                                        key="idle"
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: 20, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex items-center"
                                    >
                                        <ShoppingCart className="mr-2 h-4 w-4" />
                                        Add to Cart
                                    </motion.span>
                                )}
                                {animationState === 'animating' && (
                                    <motion.span
                                        key="animating"
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: 80, opacity: 0 }}
                                        transition={{ duration: 0.4, ease: "easeIn" }}
                                        className="flex items-center"
                                        onAnimationComplete={() => {
                                            setAnimationState('added');
                                            setTimeout(() => setAnimationState('idle'), 2000);
                                        }}
                                    >
                                        <ShoppingCart className="mr-2 h-4 w-4" />
                                    </motion.span>
                                )}
                                {animationState === 'added' && (
                                    <motion.span
                                        key="added"
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: 20, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex items-center"
                                    >
                                        <ThumbsUp className="mr-2 h-5 w-5" />
                                        Added to Cart
                                    </motion.span>
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
        </>
    );
}
