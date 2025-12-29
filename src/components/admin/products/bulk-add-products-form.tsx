
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
import { createBulkProducts } from "@/actions/products";
import { useTransition, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, ChevronDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import Image from "next/image";

const CATEGORIES = ["Oversize T-Shirts", "Regular T-Shirts", "Kids T-Shirts", "Hoodie"];

const productSchema = z.object({
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
});

const bulkFormSchema = z.object({
    products: z.array(productSchema).min(1, "At least one product is required").max(10, "Maximum 10 products allowed per bulk upload"),
});

type FormValues = z.infer<typeof bulkFormSchema>;

interface BulkProductFormProps {
    onSuccess?: () => void;
}

export function BulkAddProductsForm({ onSuccess }: BulkProductFormProps) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const [imagePreviews, setImagePreviews] = useState<Record<number, File[]>>({});
    const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(bulkFormSchema),
        defaultValues: {
            products: [{ 
                name: "", 
                slug: "", 
                description: "", 
                price: "", 
                originalPrice: "", 
                category: "",
                sizes: "",
                colors: "",
                isTrending: false 
            }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "products",
    });

    const nameWatch = form.watch('products');

    useEffect(() => {
        // This is to auto-generate slug. It runs when the name of any product changes.
        if (nameWatch) {
            nameWatch.forEach((product, index) => {
                const currentSlug = form.getValues(`products.${index}.slug`);
                if (product.name && !currentSlug) {
                    const slug = product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
                    form.setValue(`products.${index}.slug`, slug, { shouldValidate: true });
                }
            });
        }
    }, [nameWatch, form]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const files = event.target.files;
        if (files) {
            setImagePreviews(prev => ({
                ...prev,
                [index]: [...(prev[index] || []), ...Array.from(files)]
            }));
        }
    };

    const removeImage = (productIndex: number, imageIndex: number) => {
        setImagePreviews(prev => ({
            ...prev,
            [productIndex]: prev[productIndex].filter((_, i) => i !== imageIndex)
        }));
    };

    function onSubmit(data: FormValues) {
        // Validate all products before starting upload
        const validationErrors: string[] = [];
        
        data.products.forEach((product, index) => {
            const productNum = index + 1;
            
            // Check required fields
            if (!product.name?.trim()) {
                validationErrors.push(`Product ${productNum}: Name is required`);
            }
            if (!product.slug?.trim()) {
                validationErrors.push(`Product ${productNum}: Slug is required`);
            }
            if (!product.description?.trim()) {
                validationErrors.push(`Product ${productNum}: Description should not be blank`);
            }
            if (!product.price?.trim()) {
                validationErrors.push(`Product ${productNum}: Price is required`);
            }
            if (!product.category?.trim()) {
                validationErrors.push(`Product ${productNum}: Category is required`);
            }
            
            // Check for images
            if (!imagePreviews[index] || imagePreviews[index].length === 0) {
                validationErrors.push(`Product ${productNum}: At least one image is required`);
            }
        });
        
        // If there are validation errors, show them and stop
        if (validationErrors.length > 0) {
            validationErrors.forEach(error => {
                toast({
                    variant: "destructive",
                    title: "Validation Error",
                    description: error,
                    duration: 5000
                });
            });
            return;
        }
        
        startTransition(async () => {
            const totalProducts = data.products.length;
            setUploadProgress({ current: 0, total: totalProducts });
            
            let successCount = 0;
            let failCount = 0;
            
            // Upload products one at a time
            for (let index = 0; index < data.products.length; index++) {
                const product = data.products[index];
                
                // Update progress
                setUploadProgress({ current: index + 1, total: totalProducts });
                
                // Create FormData for single product
                const formData = new FormData();
                
                Object.entries(product).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        if (typeof value === "boolean") {
                            if (value) formData.append(`products[0].${key}`, "on");
                        } else {
                            formData.append(`products[0].${key}`, value.toString());
                        }
                    }
                });

                // Append images for the current product
                if (imagePreviews[index]) {
                    imagePreviews[index].forEach(file => {
                        formData.append(`productImages[0]`, file);
                    });
                }

                // Upload single product
                try {
                    const result = await createBulkProducts(null, formData);
                    
                    if (result.success) {
                        successCount++;
                        toast({ 
                            title: "✓ Product Uploaded", 
                            description: `${product.name} (${index + 1}/${totalProducts})`,
                            duration: 2000
                        });
                    } else {
                        failCount++;
                        toast({ 
                            variant: "destructive", 
                            title: "Failed", 
                            description: `${product.name}: ${result.error || "Upload failed"}`,
                            duration: 3000
                        });
                    }
                } catch (error) {
                    failCount++;
                    toast({ 
                        variant: "destructive", 
                        title: "Error", 
                        description: `${product.name}: ${error instanceof Error ? error.message : "Unknown error"}`,
                        duration: 3000
                    });
                }
                
                // Wait 2 seconds before next upload (except for last product)
                if (index < data.products.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            }
            
            // Show final summary
            setUploadProgress(null);
            
            if (failCount === 0) {
                toast({ 
                    title: "All Products Uploaded Successfully!", 
                    description: `${successCount} products added to your store.`,
                    duration: 5000
                });
                form.reset();
                setImagePreviews({});
                onSuccess?.();
            } else if (successCount > 0) {
                toast({ 
                    title: "Partial Upload Complete", 
                    description: `${successCount} succeeded, ${failCount} failed. Please check and retry failed products.`,
                    variant: "default",
                    duration: 5000
                });
            } else {
                toast({ 
                    variant: "destructive",
                    title: "Upload Failed", 
                    description: "All products failed to upload. Please check your connection and try again.",
                    duration: 5000
                });
            }
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {form.formState.errors.products?.root?.message && (
                    <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md text-sm">
                        {form.formState.errors.products.root.message}
                    </div>
                )}
                <ScrollArea className="h-[60vh] pr-4">
                    <div className="space-y-4">
                        {fields.map((field, index) => (
                            <Collapsible key={field.id} defaultOpen className="p-4 border rounded-lg space-y-4">
                                <div className="flex justify-between items-center">
                                    <CollapsibleTrigger asChild>
                                        <div className="flex items-center gap-2 cursor-pointer">
                                            <h3 className="font-semibold text-lg">Product {index + 1}</h3>
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
                                    {/* All form fields go here */}
                                     <div className="grid grid-cols-2 gap-4">
                                        <FormField name={`products.${index}.name`} render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl><Input {...field} onChange={(e) => {
                                                    field.onChange(e);
                                                    const slug = e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
                                                    form.setValue(`products.${index}.slug`, slug);
                                                }} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <FormField name={`products.${index}.slug`} render={({ field }) => (
                                            <FormItem><FormLabel>Slug</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                    </div>
                                    <FormField name={`products.${index}.description`} render={({ field }) => (
                                        <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField name={`products.${index}.price`} render={({ field }) => (
                                            <FormItem><FormLabel>Price</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                         <FormField name={`products.${index}.originalPrice`} render={({ field }) => (
                                            <FormItem><FormLabel>Original Price (Optional)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                    </div>
                                    <FormField name={`products.${index}.category`} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                                                <SelectContent>{CATEGORIES.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                     <div className="grid grid-cols-2 gap-4">
                                        <FormField name={`products.${index}.sizes`} render={({ field }) => (
                                            <FormItem><FormLabel>Sizes (comma separated)</FormLabel><FormControl><Input placeholder="S, M, L, XL" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField name={`products.${index}.colors`} render={({ field }) => (
                                            <FormItem><FormLabel>Colors (comma separated)</FormLabel><FormControl><Input placeholder="Red, Blue, Green" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                    </div>
                                     <div className="space-y-2">
                                        <FormLabel>Images</FormLabel>
                                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                                            {(imagePreviews[index] || []).map((file, imgIndex) => (
                                                <div key={imgIndex} className="relative group aspect-square">
                                                    <Image src={URL.createObjectURL(file)} alt="Preview" fill className="object-cover rounded-md" />
                                                    <Button type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2 h-5 w-5 rounded-full opacity-0 group-hover:opacity-100" onClick={() => removeImage(index, imgIndex)}><Trash2 className="h-3 w-3" /></Button>
                                                </div>
                                            ))}
                                        </div>
                                        <FormControl>
                                            <Input type="file" accept="image/*" multiple onChange={(e) => handleFileChange(e, index)} className="text-muted-foreground file:text-foreground" />
                                        </FormControl>
                                    </div>
                                    <FormField name={`products.${index}.isTrending`} render={({ field }) => (
                                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                            <div className="space-y-1 leading-none"><FormLabel>Trending</FormLabel></div>
                                        </FormItem>
                                    )} />
                                </CollapsibleContent>
                            </Collapsible>
                        ))}
                    </div>
                </ScrollArea>
                
                <div className="flex justify-between items-center pt-4 border-t">
                    <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                            if (fields.length >= 10) {
                                toast({
                                    variant: "destructive",
                                    title: "Limit Reached",
                                    description: "Maximum 10 products allowed per bulk upload"
                                });
                                return;
                            }
                            append({ name: "", slug: "", description: "", price: "", originalPrice: "", category: "", sizes: "", colors: "", isTrending: false });
                        }}
                        disabled={fields.length >= 10 || isPending}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Another Product {fields.length >= 10 ? "(Max 10)" : `(${fields.length}/10)`}
                    </Button>
                    <div className="flex items-center gap-4">
                        {uploadProgress && (
                            <div className="text-sm text-muted-foreground">
                                Uploading {uploadProgress.current} of {uploadProgress.total}...
                            </div>
                        )}
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            {isPending ? (uploadProgress ? `Uploading ${uploadProgress.current}/${uploadProgress.total}` : "Saving...") : "Save All Products"}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    );
}
