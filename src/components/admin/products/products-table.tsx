
"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ExternalLink } from "lucide-react";
import Link from 'next/link';
import { deleteProduct } from "@/app/actions/products";
import { useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ProductForm } from "./product-form";
import type { Product } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export function ProductsTable({ products }: { products: Product[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>All Products</CardTitle>
                <CardDescription>
                    A list of all products in your inventory. You can edit or delete them here.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Image</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>GSM/Price</TableHead>
                                <TableHead className="text-center">Trending</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                        No products found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                products.map((product) => (
                                    <ProductRow key={product.id} product={product} />
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}

function ProductRow({ product }: { product: Product }) {
    const [isPending, startTransition] = useTransition();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const { toast } = useToast();

    // Safely checks
    const sizes = Array.isArray(product.sizes) ? product.sizes : [];
    const colors = Array.isArray(product.colors) ? product.colors : [];

    const handleDelete = () => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        startTransition(async () => {
            const result = await deleteProduct(Number(product.id));
            if (result.success) {
                toast({
                    title: "Deleted",
                    description: "Product deleted successfully",
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to delete product",
                });
            }
        });
    };

    // Parse images if it's a string
    const getImageUrl = (product: Product) => {
        if (!product.images) return null;

        // If already an array, use first element
        if (Array.isArray(product.images)) {
            return product.images[0] || null;
        }

        // If string, try to parse as JSON
        if (typeof product.images === 'string') {
            try {
                const parsed = JSON.parse(product.images);
                return Array.isArray(parsed) ? parsed[0] : null;
            } catch {
                // If not JSON, might be comma-separated
                const split = (product.images as string).split(',').map((s: string) => s.trim()).filter((s: string) => s);
                return split[0] || null;
            }
        }

        return null;
    };

    const imageUrl = getImageUrl(product);

    return (
        <TableRow>
            <TableCell>
                <div className="relative h-10 w-10 overflow-hidden rounded-md bg-muted">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={product.name}
                            className="object-cover w-full h-full"
                            onError={(e) => {
                                console.error('[ProductTable] Image failed to load:', imageUrl);
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                            No img
                        </div>
                    )}
                </div>
            </TableCell>
            <TableCell className="font-medium">
                {product.name}
            </TableCell>
            <TableCell className="text-muted-foreground text-sm">
                {product.sku || "-"}
            </TableCell>
            <TableCell>{product.category || "-"}</TableCell>
            <TableCell>
                {product.category === "Oversize T-Shirts" && product.gsm180Price && product.gsm240Price ? (
                    <div className="text-xs border rounded overflow-hidden">
                        <div className="grid grid-cols-2 bg-muted/50 p-1 font-medium border-b text-center">
                            <div>180 GSM</div>
                            <div>240 GSM</div>
                        </div>
                        <div className="grid grid-cols-2 p-1 text-center divide-x">
                            <div>₹{Number(product.gsm180Price).toFixed(0)}</div>
                            <div>₹{Number(product.gsm240Price).toFixed(0)}</div>
                        </div>
                    </div>
                ) : (
                    <span>₹{Number(product.price).toFixed(2)}</span>
                )}
            </TableCell>
            <TableCell className="text-center">
                <Checkbox checked={product.isTrending} disabled aria-label="Trending" />
            </TableCell>
            <TableCell className="text-right flex items-center justify-end gap-2">
                <Button variant="ghost" size="icon" asChild title="View Product">
                    <Link href={`/products/${product.slug}`} target="_blank">
                        <ExternalLink className="h-4 w-4" />
                    </Link>
                </Button>

                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]" onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
                        <DialogHeader>
                            <DialogTitle>Edit Product</DialogTitle>
                            <DialogDescription>
                                Update product details.
                            </DialogDescription>
                        </DialogHeader>
                        <ProductForm product={product} onSuccess={() => setIsEditOpen(false)} />
                    </DialogContent>
                </Dialog>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDelete}
                    disabled={isPending}
                >
                    <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
            </TableCell>
        </TableRow>
    );
}
