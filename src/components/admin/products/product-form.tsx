
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
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
import { Loader2, Trash2, UploadCloud, X } from "lucide-react";

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
    isTrending: z.boolean().default(false),
    isVisible: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
    onSuccess?: () => void;
    product?: Product;
}

const parseImages = (images: any): string[] => {
    if (!images) return [];
    if (Array.isArray(images)) return images;
    if (typeof images === 'string') {
        try {
            const parsed = JSON.parse(images);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return images.split(',').map(s => s.trim()).filter(Boolean);
        }
    }
    return [];
};


export function ProductForm({ onSuccess, product }: ProductFormProps) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    
    // State for managing images for preview
    const [newImages, setNewImages] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>(product ? parseImages(product.images) : []);

    const formatJsonField = (value: any): string => {
        if (!value) return "";
        if (Array.isArray(value)) {
            // If it's already an array, join it.
            return value.join(", ");
        }
        if (typeof value === 'string') {
            try {
                // Try parsing it as JSON. It might be a string like '["S", "M"]'.
                const parsed = JSON.parse(value);
                if (Array.isArray(parsed)) {
                    return parsed.join(", ");
                }
            } catch (e) {
                // If parsing fails, it's probably already a comma-separated string.
                return value;
            }
        }
        // Fallback for other types, though it should usually be one of the above.
        return String(value);
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
            isTrending: product?.isTrending || false,
            isVisible: product?.isVisible !== undefined ? product.isVisible : true,
        },
    });

    const nameValue = form.watch("name");
    useEffect(() => {
        if (nameValue && !product) { // Only auto-slug on create
            const slug = nameValue
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^\w-]+/g, '');
            form.setValue("slug", slug);
        }
    }, [nameValue, form, product]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newFileArray = Array.from(files);
            if (newImages.length + existingImages.length + newFileArray.length > 5) {
                toast({
                    variant: "destructive",
                    title: "Image limit reached",
                    description: "You can upload a maximum of 5 images in total.",
                });
                return;
            }
            setNewImages(prev => [...prev, ...newFileArray]);
        }
    };
    
    const removeNewImage = (index: number) => {
        setNewImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (index: number) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    function onSubmit(data: FormValues) {
        console.log("[ProductForm] Form submitted with data:", data);
        
        startTransition(async () => {
            const formData = new FormData();
            
            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    if (typeof value === "boolean") {
                        if (value) formData.append(key, "on");
                    } else {
                        formData.append(key, value.toString());
                    }
                }
            });

            // Append new image files
            newImages.forEach(file => {
                formData.append("productImages", file);
            });

            // Append remaining existing images
            formData.append("existingImages", existingImages.join(','));

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
                form.reset();
                setNewImages([]);
                setExistingImages([]);
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

    const allImages = [...existingImages.map(url => ({ type: 'url', value: url })), ...newImages.map(file => ({ type: 'file', value: file }))];

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[80vh] overflow-y-auto px-1">
                {/* ... other fields ... */}
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
                    <FormLabel>Product Images (Upload up to 5)</FormLabel>
                     {/* Image Preview Area */}
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {allImages.map((img, index) => (
                            <div key={index} className="relative group aspect-square">
                                <Image
                                    src={img.type === 'url' ? img.value : URL.createObjectURL(img.value)}
                                    alt={`Preview ${index + 1}`}
                                    fill
                                    className="object-cover rounded-md border"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => img.type === 'url' ? removeExistingImage(existingImages.indexOf(img.value)) : removeNewImage(newImages.indexOf(img.value))}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                                {index === 0 && <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] text-center py-0.5 rounded-b-md">Main</span>}
                            </div>
                        ))}
                    </div>

                    <FormControl>
                         <div className="relative border-2 border-dashed border-muted-foreground/50 rounded-lg p-6 text-center hover:border-primary transition-colors">
                            <UploadCloud className="mx-auto h-10 w-10 text-muted-foreground mb-2"/>
                            <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>
                            <Input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                    </FormControl>
                    <FormDescription>
                        First image will be the main product image.
                    </FormDescription>
                    <FormMessage />
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
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    {isPending ? (product ? "Updating..." : "Creating...") : (product ? "Update Product" : "Create Product")}
                </Button>
            </form>
        </Form>
    );
}

    