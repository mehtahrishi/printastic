"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createProduct, updateProduct } from "@/app/actions/products";
import { useState, useTransition, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/types";

const CATEGORIES = ["Oversize T-Shirts", "Regular T-Shirts", "Kids T-Shirts", "Hoodie",];

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required"),
    description: z.string().min(1, "Description is required"),
    price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
        message: "Price must be a positive number",
    }),
    originalPrice: z.string().optional(),
    category: z.string().optional(),
    sizes: z.string().optional(),
    colors: z.string().optional(),
    productImages: z.any().optional(),
    images: z.string().optional(),
    isTrending: z.boolean().default(false),
    isVisible: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
    onSuccess?: () => void;
    product?: Product; // Added product prop for editing
}

export function ProductForm({ onSuccess, product }: ProductFormProps) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const formatJsonField = (value: any) => {
        if (Array.isArray(value)) {
            return value.join(", ");
        }
        if (typeof value === "string") {
            try {
                const parsed = JSON.parse(value);
                if (Array.isArray(parsed)) {
                    return parsed.join(", ");
                }
            } catch (e) {
                // Not a JSON array, return as is
            }
            return value;
        }
        return "";
    };

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: product?.name || "",
            slug: product?.slug || "",
            description: product?.description || "",
            price: product?.price?.toString() || "",
            originalPrice: product?.originalPrice?.toString() || "",
            category: product?.category || "",
            sizes: formatJsonField(product?.sizes),
            colors: formatJsonField(product?.colors),
            images: formatJsonField(product?.images),
            isTrending: product?.isTrending || false,
            isVisible: product?.isVisible !== undefined ? product.isVisible : true,
        },
    });

    // Watch name to auto-generate slug
    const nameValue = form.watch("name");
    useEffect(() => {
        if (nameValue) {
            const slug = nameValue
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^\w-]+/g, '');
            form.setValue("slug", slug);
        }
    }, [nameValue, form]);

    function onSubmit(data: FormValues) {
        console.log("[ProductForm] Form submitted with data:", data);
        
        startTransition(async () => {
            const formData = new FormData();
            
            // Handle file uploads separately to ensure proper FormData encoding
            let hasFiles = false;
            if (data.productImages && data.productImages.length > 0) {
                console.log(`[ProductForm] Adding ${data.productImages.length} files to FormData`);
                for (let i = 0; i < data.productImages.length; i++) {
                    const file = data.productImages[i];
                    console.log(`[ProductForm] File ${i}:`, {
                        name: file.name,
                        size: file.size,
                        type: file.type
                    });
                    formData.append("productImages", file, file.name);
                    hasFiles = true;
                }
            } else {
                console.log("[ProductForm] No files to upload");
            }
            
            // Add other fields
            Object.entries(data).forEach(([key, value]) => {
                if (key === "productImages") {
                    // Already handled above
                    return;
                }
                
                if (value !== undefined && value !== null && value !== "") {
                    if (typeof value === "boolean") {
                        if (value) formData.append(key, "on");
                    } else {
                        formData.append(key, value.toString());
                    }
                }
            });

            // For updates, add existing images if no new files uploaded
            if (product && !hasFiles) {
                console.log("[ProductForm] Update mode with no new files, preserving existing images");
                if (product.images) {
                    const imagesStr = Array.isArray(product.images) 
                        ? JSON.stringify(product.images)
                        : product.images;
                    formData.append("images", imagesStr);
                }
            }

            console.log("[ProductForm] Submitting FormData to server action...");
            
            let result;
            if (product) {
                result = await updateProduct(Number(product.id), null, formData);
            } else {
                result = await createProduct(null, formData);
            }

            console.log("[ProductForm] Server action result:", result);

            if (result.success) {
                toast({
                    title: "Success",
                    description: `Product ${product ? "updated" : "created"} successfully`,
                });
                if (!product) form.reset(); // Don't reset on edit
                onSuccess?.();
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: result.error || "Something went wrong",
                });
                console.error("[ProductForm] Error details:", result);
            }
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[80vh] overflow-y-auto px-1">

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Product name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Slug</FormLabel>
                                <FormControl>
                                    <Input placeholder="product-slug" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Short description" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                    <Input placeholder="29.99" type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="originalPrice"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Original Price (Optional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="39.99" type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {CATEGORIES.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="sizes"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Sizes (comma separated)</FormLabel>
                                <FormControl>
                                    <Input placeholder="S, M, L, XL" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="colors"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Colors (comma separated)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Red, Blue, Green" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="productImages"
                        render={({ field: { value, onChange, ...fieldProps } }) => (
                            <FormItem>
                                <FormLabel>Product Images (Upload up to 5)</FormLabel>
                                <FormControl>
                                    <Input
                                        {...fieldProps}
                                        placeholder="Upload images"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(event) => {
                                            const files = event.target.files;
                                            console.log("[FileInput] Files selected:", files?.length);
                                            
                                            if (files && files.length > 5) {
                                                toast({
                                                    variant: "destructive",
                                                    title: "Too many files",
                                                    description: "You can only upload a maximum of 5 images.",
                                                });
                                                event.target.value = ""; // Clear input
                                                return;
                                            }
                                            
                                            if (files && files.length > 0) {
                                                // Convert FileList to Array for better handling
                                                const fileArray = Array.from(files);
                                                console.log("[FileInput] File details:", fileArray.map(f => ({
                                                    name: f.name,
                                                    size: f.size,
                                                    type: f.type
                                                })));
                                                onChange(fileArray);
                                            } else {
                                                onChange(null);
                                            }
                                        }}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Upload 1-5 images. First image will be the main product image.
                                </FormDescription>
                                {/* Preview current images */}
                                {product && product.images && (
                                    <div className="mt-2">
                                        <p className="text-sm text-muted-foreground mb-1">Current Images:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {(Array.isArray(product.images)
                                                ? product.images
                                                : (typeof product.images === 'string'
                                                    ? ((product.images as string).trim().startsWith('[')
                                                        ? (() => { try { return JSON.parse(product.images as string); } catch { return []; } })()
                                                        : (product.images as string).split(",").map((s: string) => s.trim()).filter((s: string) => s))
                                                    : [])
                                            ).map((img, idx) => (
                                                <div key={idx} className="relative group">
                                                    <img src={img} alt={`Product ${idx + 1}`} className="h-20 w-20 object-cover rounded-md border" />
                                                    {idx === 0 && <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] text-center py-0.5">Main</span>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex gap-6">
                    <FormField
                        control={form.control}
                        name="isTrending"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        Trending
                                    </FormLabel>
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="isVisible"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        Visible
                                    </FormLabel>
                                </div>
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" disabled={isPending} className="w-full">
                    {isPending ? (product ? "Updating..." : "Creating...") : (product ? "Update Product" : "Create Product")}
                </Button>
            </form>
        </Form>
    );
}
