
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
import { useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

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

    form.control.register('products'); // ensure field array is registered

    const handleNameChange = (value: string, index: number) => {
        const slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
        form.setValue(`products.${index}.slug`, slug);
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
            });

            const result = await createBulkProducts(null, formData);

            if (result.success) {
                toast({
                    title: "Success",
                    description: result.message,
                });
                form.reset();
                onSuccess?.();
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: result.error || "Something went wrong",
                });
            }
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <ScrollArea className="h-[60vh] pr-4">
                    <div className="space-y-8">
                        {fields.map((field, index) => (
                            <div key={field.id} className="p-4 border rounded-lg relative space-y-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 h-7 w-7"
                                    onClick={() => remove(index)}
                                    disabled={fields.length <= 1}
                                >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                                <h3 className="font-semibold text-lg">Product {index + 1}</h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name={`products.${index}.name`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} onChange={(e) => {
                                                        field.onChange(e);
                                                        handleNameChange(e.target.value, index);
                                                    }} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`products.${index}.slug`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Slug</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name={`products.${index}.description`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name={`products.${index}.price`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Price</FormLabel>
                                                <FormControl>
                                                    <Input type="number" step="0.01" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                     <FormField
                                        control={form.control}
                                        name={`products.${index}.originalPrice`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Original Price (Optional)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" step="0.01" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name={`products.${index}.category`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {CATEGORIES.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                 <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name={`products.${index}.sizes`}
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
                                        name={`products.${index}.colors`}
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
                                <FormField
                                    control={form.control}
                                    name={`products.${index}.isTrending`}
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
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                
                <div className="flex justify-between items-center pt-4 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => append({ name: "", slug: "", description: "", price: "", originalPrice: "", category: "", sizes: "", colors: "", isTrending: false })}
                    >
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
