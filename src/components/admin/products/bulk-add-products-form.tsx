
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
    products: z.array(productSchema),
});

type FormValues = z.infer<typeof bulkFormSchema>;

interface BulkProductFormProps {
    onSuccess?: () => void;
}

export function BulkAddProductsForm({ onSuccess }: BulkProductFormProps) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const [imagePreviews, setImagePreviews] = useState<Record<number, File[]>>({});

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
        startTransition(async () => {
            const formData = new FormData();
            
            data.products.forEach((product, index) => {
                Object.entries(product).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                         if (typeof value === "boolean") {
                            if (value) formData.append(`products[${index}].${key}`, "on");
                        } else {
                            formData.append(`products[${index}].${key}`, value.toString());
                        }
                    }
                });

                // Append images for the current product
                if (imagePreviews[index]) {
                    imagePreviews[index].forEach(file => {
                        formData.append(`productImages[${index}]`, file);
                    });
                }
            });

            const result = await createBulkProducts(null, formData);

            if (result.success) {
                toast({ title: "Success", description: result.message });
                form.reset();
                setImagePreviews({});
                onSuccess?.();
            } else {
                toast({ variant: "destructive", title: "Error", description: result.error || "Something went wrong" });
            }
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    <Button type="button" variant="outline" onClick={() => append({ name: "", slug: "", description: "", price: "", originalPrice: "", category: "", sizes: "", colors: "", isTrending: false })}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Another Product
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                        {isPending ? "Saving..." : "Save All Products"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
