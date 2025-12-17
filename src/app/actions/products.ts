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
    images: z.string().optional(), // Array of image URLs
    isTrending: z.coerce.boolean().optional(),
    isVisible: z.coerce.boolean().optional(),
});

async function uploadToCloudinary(file: File) {
    try {
        console.log(`[Cloudinary] Starting upload for: ${file.name} (${file.size} bytes)`);
        
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { 
                    folder: process.env.CLOUDINARY_FOLDER || "INHOUSE",
                    resource_type: 'auto'
                },
                (error, result) => {
                    if (error) {
                        console.error(`[Cloudinary] Upload error for ${file.name}:`, error);
                        reject(error);
                        return;
                    }
                    console.log(`[Cloudinary] Upload successful for ${file.name}:`, result?.secure_url);
                    resolve(result);
                }
            ).end(buffer);
        });
    } catch (error) {
        console.error(`[Cloudinary] Exception during upload for ${file.name}:`, error);
        throw error;
    }
}

// Helper to upload multiple files
async function uploadMultipleToCloudinary(files: File[]) {
    console.log(`[Upload] Processing ${files.length} files`);
    
    // Filter out invalid files
    const validFiles = files.filter(file => {
        const isValid = file && 
                       file instanceof File && 
                       file.size > 0 && 
                       file.name && 
                       file.name !== "undefined" &&
                       file.type.startsWith('image/');
        
        if (!isValid) {
            console.warn(`[Upload] Skipping invalid file:`, {
                name: file?.name,
                size: file?.size,
                type: file?.type,
                isFile: file instanceof File
            });
        }
        return isValid;
    });

    console.log(`[Upload] Valid files to upload: ${validFiles.length}`);

    if (validFiles.length === 0) {
        return [];
    }

    const uploadPromises = validFiles.map(async (file) => {
        try {
            const result: any = await uploadToCloudinary(file);
            return result.secure_url;
        } catch (error) {
            console.error(`[Upload] Failed to upload ${file.name}:`, error);
            return null;
        }
    });

    const results = await Promise.all(uploadPromises);
    const successfulUploads = results.filter((url) => url !== null) as string[];
    
    console.log(`[Upload] Successfully uploaded ${successfulUploads.length} out of ${validFiles.length} files`);
    return successfulUploads;
}

export async function createProduct(prevState: any, formData: FormData) {
    console.log("[CreateProduct] Starting product creation");
    
    // Handle Images Upload
    const productImages = formData.getAll("productImages") as File[];
    console.log(`[CreateProduct] Received ${productImages.length} files from form`);
    
    const uploadedImageUrls = await uploadMultipleToCloudinary(productImages);

    console.log(`[CreateProduct] Uploaded ${uploadedImageUrls.length} images:`, uploadedImageUrls);

    if (uploadedImageUrls.length === 0) {
        console.error("[CreateProduct] No images were uploaded successfully");
        return { 
            error: "At least one image is required. Please ensure you've selected valid image files.",
            details: "No images were uploaded. Check console for details."
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
        images: uploadedImageUrls.join(", "),
        isTrending: formData.get("isTrending") === "on",
        isVisible: formData.get("isVisible") === "on",
    });

    if (!validatedFields.success) {
        console.error("[CreateProduct] Validation failed:", validatedFields.error.flatten().fieldErrors);
        return {
            error: "Invalid fields",
            fieldErrors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const insertData = {
        name: validatedFields.data.name,
        slug: validatedFields.data.slug,
        description: validatedFields.data.description,
        price: validatedFields.data.price.toString(),
        originalPrice: validatedFields.data.originalPrice?.toString(),
        category: validatedFields.data.category,

        sizes: validatedFields.data.sizes ? validatedFields.data.sizes.split(",").map(s => s.trim()) : null,
        colors: validatedFields.data.colors ? validatedFields.data.colors.split(",").map(c => c.trim()) : null,
        images: uploadedImageUrls,
        isTrending: validatedFields.data.isTrending || false,
        isVisible: validatedFields.data.isVisible !== false,
    };

    console.log("[CreateProduct] Inserting data into database:", {
        ...insertData,
        images: insertData.images,
    });

    try {
        const result = await db.insert(products).values(insertData);
        console.log("[CreateProduct] Database insert successful:", result);

        revalidatePath("/admin/products");
        revalidatePath(`/products/${insertData.slug}`);
        console.log("[CreateProduct] Product created successfully and cache revalidated");
        return { success: true, message: "Product created successfully" };
    } catch (error) {
        console.error("[CreateProduct] Database insert failed:", error);
        if (error instanceof Error) {
            console.error("[CreateProduct] Error details:", error.message);
            console.error("[CreateProduct] Error stack:", error.stack);
        }
        return { error: `Failed to create product: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
}

export async function updateProduct(productId: number, prevState: any, formData: FormData) {
    console.log(`[UpdateProduct] Starting product update for ID: ${productId}`);
    
    // Handle New Images Upload
    const productImages = formData.getAll("productImages") as File[];
    console.log(`[UpdateProduct] Received ${productImages.length} files from form`);
    
    const newImageUrls = await uploadMultipleToCloudinary(productImages);
    console.log(`[UpdateProduct] Successfully uploaded ${newImageUrls.length} new images`);

    // Get existing images from form (if any)
    let existingImagesString = formData.get("images")?.toString() || "";
    
    // Parse existing images into array
    let existingImagesArray: string[] = [];
    if (existingImagesString) {
        try {
            // Try parsing as JSON first
            existingImagesArray = JSON.parse(existingImagesString);
        } catch {
            // If not JSON, split by comma
            existingImagesArray = existingImagesString.split(",").map(s => s.trim()).filter(s => s);
        }
    }
    
    console.log("[UpdateProduct] Existing images:", existingImagesArray);

    // Handle new image uploads - combine with existing
    if (newImageUrls.length > 0) {
        existingImagesArray = [...existingImagesArray, ...newImageUrls];
    }
    
    console.log("[UpdateProduct] Final images array:", existingImagesArray);
    
    if (existingImagesArray.length === 0) {
        console.error("[UpdateProduct] No images available");
        return { 
            error: "At least one image is required."
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
        images: existingImagesArray.join(", "),
        isTrending: formData.get("isTrending") === "on",
        isVisible: formData.get("isVisible") === "on",
    });

    if (!validatedFields.success) {
        console.error("[UpdateProduct] Validation failed:", validatedFields.error.flatten().fieldErrors);
        return {
            error: "Invalid fields",
            fieldErrors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const updateData = {
        name: validatedFields.data.name,
        slug: validatedFields.data.slug,
        description: validatedFields.data.description,
        price: validatedFields.data.price.toString(),
        originalPrice: validatedFields.data.originalPrice?.toString(),
        category: validatedFields.data.category,

        sizes: validatedFields.data.sizes ? validatedFields.data.sizes.split(",").map(s => s.trim()) : null,
        colors: validatedFields.data.colors ? validatedFields.data.colors.split(",").map(c => c.trim()) : null,
        images: existingImagesArray,
        isTrending: validatedFields.data.isTrending || false,
        isVisible: validatedFields.data.isVisible !== false,
    };

    console.log("[UpdateProduct] Updating database with:", {
        ...updateData,
        images: updateData.images,
    });

    try {
        const result = await db.update(products).set(updateData).where(eq(products.id, productId));
        console.log("[UpdateProduct] Database update successful:", result);

        revalidatePath("/admin/products");
        revalidatePath(`/products/${updateData.slug}`);
        console.log("[UpdateProduct] Product updated successfully and cache revalidated");
        return { success: true, message: "Product updated successfully" };
    } catch (error) {
        console.error("[UpdateProduct] Database update failed:", error);
        if (error instanceof Error) {
            console.error("[UpdateProduct] Error details:", error.message);
            console.error("[UpdateProduct] Error stack:", error.stack);
        }
        return { error: `Failed to update product: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
}

export async function deleteProduct(productId: number) {
    try {
        // First, find the product to get its slug for revalidation
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

export async function getProducts(includeHidden = false) {
    try {
        let fetchedProducts;
        if (includeHidden) {
            fetchedProducts = await db.select().from(products).orderBy(desc(products.createdAt));
        } else {
            fetchedProducts = await db.select().from(products).where(eq(products.isVisible, true)).orderBy(desc(products.createdAt));
        }
        
        return fetchedProducts;
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return [];
    }
}

export async function getProductsCount(onlyActive = false) {
    try {
        if (onlyActive) {
            const result = await db.select({ count: products.id }).from(products).where(eq(products.isVisible, true));
            return result.length;
        }
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
