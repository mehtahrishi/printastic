
"use server";

import { db } from "@/lib/db";
import { products, productPreviews } from "@/db/schema";
import { eq, desc, or, like } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import cloudinary from "@/lib/cloudinary";

const productSchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required"),
    description: z.string().min(1, "Description is required"),
    price: z.coerce.number().min(0, "Price must be positive"),
    originalPrice: z.coerce.number().optional(),
    category: z.string().optional(),
    sizes: z.string().optional(), // "S, M, L"
    colors: z.string().optional(), // "Red, Blue"
    images: z.array(z.string()).optional(), // Array of image URLs
    isTrending: z.coerce.boolean().optional(),
});

const bulkProductSchema = z.object({
    products: z.array(productSchema.omit({ images: true })).min(1, "At least one product is required").max(10, "Maximum 10 products allowed per bulk upload")
});


async function uploadToCloudinary(file: File) {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { 
                    folder: process.env.CLOUDINARY_FOLDER || "INHOUSE",
                    resource_type: 'auto'
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        });
    } catch (error) {
        throw error;
    }
}

async function uploadMultipleToCloudinary(files: File[]) {
    const validFiles = files.filter(file => file && file.size > 0 && file.type.startsWith('image/'));
    if (validFiles.length === 0) return [];

    const uploadPromises = validFiles.map(file => uploadToCloudinary(file));
    const results = await Promise.all(uploadPromises);
    return results.map((result: any) => result.secure_url).filter(Boolean);
}


export async function createBulkProducts(prevState: any, formData: FormData) {
    const productsData: Record<string, any> = {};
    const imageFiles: Record<number, File[]> = {};

    for (const [key, value] of formData.entries()) {
        const productMatch = key.match(/products\[(\d+)\]\.(.*)/);
        if (productMatch) {
            const index = parseInt(productMatch[1], 10);
            const field = productMatch[2];
            if (!productsData[index]) productsData[index] = {};
            productsData[index][field] = value;
        }

        const imageMatch = key.match(/productImages\[(\d+)\]/);
        if (imageMatch && value instanceof File) {
            const index = parseInt(imageMatch[1], 10);
            if (!imageFiles[index]) imageFiles[index] = [];
            imageFiles[index].push(value);
        }
    }

    const productsToValidate = Object.values(productsData);
    
    // Enforce 10 product limit
    if (productsToValidate.length > 10) {
        return {
            error: "Maximum 10 products allowed per bulk upload. Please reduce the number of products.",
        };
    }
    
    const validatedFields = bulkProductSchema.safeParse({ products: productsToValidate });

    if (!validatedFields.success) {
        return {
            error: "Invalid fields provided.",
            fieldErrors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const productsToInsert: any[] = [];

    try {
        for (let i = 0; i < validatedFields.data.products.length; i++) {
            const p = validatedFields.data.products[i];
            const pImages = imageFiles[i] || [];
            const uploadedImageUrls = await uploadMultipleToCloudinary(pImages);

            if (uploadedImageUrls.length === 0) {
                 return { error: `Product "${p.name}" requires at least one image.` };
            }
            
            productsToInsert.push({
                name: p.name,
                slug: p.slug,
                description: p.description,
                price: p.price.toString(),
                originalPrice: p.originalPrice?.toString(),
                category: p.category,
                sizes: p.sizes ? p.sizes.split(",").map(s => s.trim()) : null,
                colors: p.colors ? p.colors.split(",").map(c => c.trim()) : null,
                images: uploadedImageUrls, 
                isTrending: p.isTrending || false,
            });
        }

        if (productsToInsert.length === 0) {
            return { error: "No products to add." };
        }

        // Insert products one by one to avoid connection issues
        let insertedCount = 0;
        for (const product of productsToInsert) {
            try {
                await db.insert(products).values(product);
                insertedCount++;
            } catch (insertError) {
                console.error(`[CreateBulkProducts] Failed to insert product "${product.name}":`, insertError);
                // Continue with next product instead of failing completely
            }
        }

        if (insertedCount === 0) {
            return { error: "Failed to insert any products. Please check the logs." };
        }
        
        revalidatePath("/admin/products");
        revalidatePath("/");
        revalidatePath("/products");
        
        const message = insertedCount === productsToInsert.length 
            ? `${insertedCount} products created successfully.`
            : `${insertedCount} of ${productsToInsert.length} products created successfully.`;
        
        return { success: true, message };
    } catch (error) {
        console.error("[CreateBulkProducts] Operation failed:", error);
        return { error: `Failed to create products: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
}



export async function createProduct(prevState: any, formData: FormData) {
    const productImages = formData.getAll("productImages") as File[];
    const uploadedImageUrls = await uploadMultipleToCloudinary(productImages);

    if (uploadedImageUrls.length === 0) {
        return { 
            error: "At least one image is required. Please ensure you've selected valid image files.",
        };
    }

    const validatedFields = productSchema.safeParse({
        name: formData.get("name"),
        slug: formData.get("slug") || formData.get("name")?.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
        description: formData.get("description"),
        price: formData.get("price"),
        originalPrice: formData.get("originalPrice") ? formData.get("originalPrice") : undefined,
        category: formData.get("category")?.toString() || undefined,
        sizes: formData.get("sizes")?.toString() || undefined,
        colors: formData.get("colors")?.toString() || undefined,
        isTrending: formData.get("isTrending") === "on",
    });

    if (!validatedFields.success) {
        return {
            error: "Invalid fields",
            fieldErrors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const insertData = {
        ...validatedFields.data,
        price: validatedFields.data.price.toString(),
        originalPrice: validatedFields.data.originalPrice?.toString(),
        sizes: validatedFields.data.sizes ? validatedFields.data.sizes.split(",").map(s => s.trim()) : null,
        colors: validatedFields.data.colors ? validatedFields.data.colors.split(",").map(c => c.trim()) : null,
        images: uploadedImageUrls,
        isTrending: validatedFields.data.isTrending || false,
    };

    try {
        await db.insert(products).values(insertData);

        revalidatePath("/admin/products");
        revalidatePath(`/products/${insertData.slug}`);
        revalidatePath("/");
        return { success: true, message: "Product created successfully" };
    } catch (error) {
        return { error: `Failed to create product: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
}

export async function updateProduct(productId: number, prevState: any, formData: FormData) {
    console.log(`[UpdateProduct] Starting product update for ID: ${productId}`);
    
    const existingImagesString = formData.get("existingImages") as string;
    const existingImages = existingImagesString ? existingImagesString.split(',') : [];
    
    const newProductImages = formData.getAll("productImages") as File[];
    const newImageUrls = await uploadMultipleToCloudinary(newProductImages);
    
    const finalImageUrls = [...existingImages, ...newImageUrls];
    
    if (finalImageUrls.length === 0) {
        return { error: "At least one image is required." };
    }

    const validatedFields = productSchema.safeParse({
        name: formData.get("name"),
        slug: formData.get("slug") || formData.get("name")?.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
        description: formData.get("description"),
        price: formData.get("price"),
        originalPrice: formData.get("originalPrice") ? formData.get("originalPrice") : undefined,
        category: formData.get("category")?.toString() || undefined,
        sizes: formData.get("sizes")?.toString() || undefined,
        colors: formData.get("colors")?.toString() || undefined,
        isTrending: formData.get("isTrending") === "on",
    });

    if (!validatedFields.success) {
        return {
            error: "Invalid fields",
            fieldErrors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const updateData = {
        ...validatedFields.data,
        price: validatedFields.data.price.toString(),
        originalPrice: validatedFields.data.originalPrice?.toString(),
        sizes: validatedFields.data.sizes ? validatedFields.data.sizes.split(",").map(s => s.trim()) : null,
        colors: validatedFields.data.colors ? validatedFields.data.colors.split(",").map(c => c.trim()) : null,
        images: finalImageUrls,
        isTrending: validatedFields.data.isTrending || false,
        updatedAt: new Date(),
    };

    try {
        await db.update(products).set(updateData).where(eq(products.id, productId));
        revalidatePath("/admin/products");
        revalidatePath(`/products/${updateData.slug}`);
        revalidatePath("/");
        return { success: true, message: "Product updated successfully" };
    } catch (error) {
        return { error: `Failed to update product: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
}


export async function deleteProduct(productId: number) {
    try {
        const productToDelete = await db.select({ slug: products.slug }).from(products).where(eq(products.id, productId)).then(res => res[0]);
        await db.delete(products).where(eq(products.id, productId));
        
        revalidatePath("/admin/products");
        revalidatePath("/");
        revalidatePath("/products");
        if (productToDelete) {
            revalidatePath(`/products/${productToDelete.slug}`);
        }
        return { success: true, message: "Product deleted successfully" };
    } catch (error) {
        console.error("Failed to delete product:", error);
        return { error: "Failed to delete product" };
    }
}

export async function getProducts() {
    try {
        const fetchedProducts = await db.select().from(products).orderBy(desc(products.createdAt));
        return fetchedProducts;
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return [];
    }
}

export async function getProductsCount() {
    try {
        const result = await db.select({ count: products.id }).from(products);
        return result.length;
    } catch (error) {
        console.error("Failed to fetch products count:", error);
        return 0;
    }
}

export async function getProduct(identifier: number | string) {
    try {
        const condition = typeof identifier === 'number'
            ? eq(products.id, identifier)
            : eq(products.slug, identifier);
        
        const product = await db.select().from(products).where(condition).then(res => res[0]);
        return product || null;
    } catch (error) {
        console.error("Failed to fetch product:", error);
        return null;
    }
}

export async function getProductPreviews(productId: number) {
    try {
        const previews = await db.select().from(productPreviews).where(eq(productPreviews.productId, productId));
        return previews;
    } catch (error) {
        console.error("Failed to fetch product previews:", error);
        return [];
    }
}
