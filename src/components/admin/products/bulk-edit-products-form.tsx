"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
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
import { updateProduct } from "@/actions/products";
import { useTransition, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, ChevronDown, UploadCloud, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Image from "next/image";
import type { Product } from "@/lib/types";

const CATEGORIES = ["Oversize T-Shirts", "Regular T-Shirts", "Kids T-Shirts", "Hoodie"];

const productSchema = z.object({
    id: z.number(),
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
    existingImages: z.array(z.string()).default([]),
});

const bulkFormSchema = z.object({
    products: z.array(productSchema).min(1, "At least one product is required"),
});

type FormValues = z.infer<typeof bulkFormSchema>;

interface BulkEditProductFormProps {
    onSuccess?: () => void;
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

const formatJsonField = (value: any): string => {
    if (!value) return "";
    if (Array.isArray(value)) {
        return value.join(", ");
    }
    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) {
                return parsed.join(", ");
            }
        } catch (e) {
            return value;
        }
    }
    return String(value);
};

export function BulkEditProductsForm({ onSuccess }: BulkEditProductFormProps) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [showSelection, setShowSelection] = useState(true);
    const [newImages, setNewImages] = useState<Record<number, File[]>>({});

    useEffect(() => {
        // Fetch products from the page
        fetch('/api/products')
            .then(res => res.json())
            .then(data => setAllProducts(data))
            .catch(err => console.error('Failed to fetch products:', err));
    }, []);

    const form = useForm<FormValues>({
        resolver: zodResolver(bulkFormSchema),
        defaultValues: {
            products: [],
        },
    });

    const { fields, remove } = useFieldArray({
        control: form.control,
        name: "products",
    });

    const handleCategoryChange = (category: string) => {
        if (!category) return;
        
        setSelectedCategory(category);
        const categoryProducts = allProducts.filter(p => p.category === category);
        
        if (categoryProducts.length === 0) {
            toast({
                variant: "destructive",
                title: "No products found",
                description: `No products found in ${category} category`,
            });
            return;
        }

        form.setValue('products', categoryProducts.map(p => ({
            id: Number(p.id),
            name: p.name,
            slug: p.slug,
            description: p.description,
            price: p.price?.toString() || "",
            originalPrice: p.originalPrice?.toString() || "",
            category: p.category || "",
            sizes: formatJsonField(p.sizes),
            colors: formatJsonField(p.colors),
            isTrending: p.isTrending || false,
            existingImages: parseImages(p.images),
        })));

        setShowSelection(false);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const files = event.target.files;
        if (files) {
            setNewImages(prev => ({
                ...prev,
                [index]: [...(prev[index] || []), ...Array.from(files)]
            }));
        }
    };

    const removeNewImage = (productIndex: number, imageIndex: number) => {
        setNewImages(prev => ({
            ...prev,
            [productIndex]: prev[productIndex].filter((_, i) => i !== imageIndex)
        }));
    };

    const removeExistingImage = (productIndex: number, imageIndex: number) => {
        const currentImages = form.getValues(`products.${productIndex}.existingImages`);
        form.setValue(
            `products.${productIndex}.existingImages`,
            currentImages.filter((_, i) => i !== imageIndex)
        );
    };

    function onSubmit(data: FormValues) {
        startTransition(async () => {
            let successCount = 0;
            let errorCount = 0;

            for (let i = 0; i < data.products.length; i++) {
                const product = data.products[i];
                const formData = new FormData();

                Object.entries(product).forEach(([key, value]) => {
                    if (key === 'id' || key === 'existingImages') return;
                    if (value !== undefined && value !== null && value !== "") {
                        if (typeof value === "boolean") {
                            if (value) formData.append(key, "on");
                        } else {
                            formData.append(key, value.toString());
                        }
                    }
                });

                // Append new images
                if (newImages[i]) {
                    newImages[i].forEach(file => {
                        formData.append("productImages", file);
                    });
                }

                // Append existing images
                formData.append("existingImages", product.existingImages.join(','));

                const result = await updateProduct(product.id, null, formData);

                if (result.success) {
                    successCount++;
                } else {
                    errorCount++;
                    console.error(`Failed to update product ${product.name}:`, result.error);
                }
            }

            if (errorCount === 0) {
                toast({ 
                    title: "Success", 
                    description: `${successCount} product(s) updated successfully` 
                });
                form.reset();
                setNewImages({});
                setSelectedCategory("");
                setShowSelection(true);
                onSuccess?.();
            } else {
                toast({ 
                    variant: "destructive", 
                    title: "Partial Success", 
                    description: `${successCount} product(s) updated, ${errorCount} failed` 
                });
            }
        });
    }

    if (showSelection) {
        return (
            <div className="space-y-6 py-4">
                <div className="text-center space-y-2 pb-4">
                    <h3 className="text-lg font-semibold">Select Product Category</h3>
                    <p className="text-sm text-muted-foreground">
                        Choose a category to edit all products within that category
                    </p>
                </div>
                
                <div className="max-w-md mx-auto space-y-3">
                    <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                        <SelectTrigger className="h-12 text-base border-2 hover:border-primary transition-colors">
                            <SelectValue placeholder="Select a category..." />
                        </SelectTrigger>
                        <SelectContent>
                            {CATEGORIES.map((cat) => (
                                <SelectItem 
                                    key={cat} 
                                    value={cat}
                                    className="text-base py-3 cursor-pointer"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                                        {cat}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    
                    <div className="bg-muted/50 rounded-lg p-4 border border-dashed">
                        <p className="text-sm text-center text-muted-foreground">
                            💡 All products from the selected category will be loaded for bulk editing
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <ScrollArea className="h-[60vh] pr-4">
                    <div className="space-y-4">
                        {fields.map((field, index) => {
                            const allImages = [
                                ...form.watch(`products.${index}.existingImages`).map(url => ({ type: 'url', value: url })),
                                ...(newImages[index] || []).map(file => ({ type: 'file', value: file }))
                            ];

                            return (
                                <Collapsible key={field.id} defaultOpen className="p-4 border rounded-lg space-y-4">
                                    <div className="flex justify-between items-center">
                                        <CollapsibleTrigger asChild>
                                            <div className="flex items-center gap-2 cursor-pointer">
                                                <h3 className="font-semibold text-lg">{form.watch(`products.${index}.name`)}</h3>
                                                <ChevronDown className="h-4 w-4 transition-transform [&[data-state=open]]:rotate-180" />
                                            </div>
                                        </CollapsibleTrigger>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => remove(index)}
                                            disabled={fields.length <= 1}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                    <CollapsibleContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField name={`products.${index}.name`} render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Name</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                            <FormField name={`products.${index}.slug`} render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Slug</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                        </div>
                                        <FormField name={`products.${index}.description`} render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Textarea {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField name={`products.${index}.price`} render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Price</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" step="0.01" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                            <FormField name={`products.${index}.originalPrice`} render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Original Price (Optional)</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" step="0.01" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                        </div>
                                        <FormField name={`products.${index}.category`} render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Category</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a category" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {CATEGORIES.map((cat) => (
                                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField name={`products.${index}.sizes`} render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Sizes (comma separated)</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="S, M, L, XL" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                            <FormField name={`products.${index}.colors`} render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Colors (comma separated)</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Red, Blue, Green" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                        </div>
                                        <div className="space-y-2">
                                            <FormLabel>Images</FormLabel>
                                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                                                {allImages.map((img, imgIndex) => (
                                                    <div key={imgIndex} className="relative group aspect-square">
                                                        <Image
                                                            src={img.type === 'url' ? img.value as string : URL.createObjectURL(img.value as File)}
                                                            alt="Preview"
                                                            fill
                                                            className="object-cover rounded-md"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="icon"
                                                            className="absolute -top-2 -right-2 h-5 w-5 rounded-full opacity-0 group-hover:opacity-100"
                                                            onClick={() => {
                                                                const existingImagesCount = form.watch(`products.${index}.existingImages`).length;
                                                                if (imgIndex < existingImagesCount) {
                                                                    removeExistingImage(index, imgIndex);
                                                                } else {
                                                                    removeNewImage(index, imgIndex - existingImagesCount);
                                                                }
                                                            }}
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="relative border-2 border-dashed border-muted-foreground/50 rounded-lg p-4 text-center hover:border-primary transition-colors">
                                                <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground mb-1"/>
                                                <p className="text-xs text-muted-foreground">Add more images</p>
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={(e) => handleFileChange(e, index)}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                        <FormField name={`products.${index}.isTrending`} render={({ field }) => (
                                            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                                <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                    <FormLabel>Trending</FormLabel>
                                                </div>
                                            </FormItem>
                                        )} />
                                    </CollapsibleContent>
                                </Collapsible>
                            );
                        })}
                    </div>
                </ScrollArea>
                
                <div className="flex justify-between items-center pt-4 border-t">
                    <Button type="button" variant="outline" onClick={() => {
                        setShowSelection(true);
                        setSelectedCategory("");
                    }}>
                        Back to Category Selection
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                        {isPending ? "Updating..." : `Update ${fields.length} Product(s)`}
                    </Button>
                </div>
            </form>
        </Form>
    );
}