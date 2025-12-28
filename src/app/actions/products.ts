
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
        revalidatePath("/");
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
    
    // Get existing images from form (these are the ones the user didn't remove)
    const existingImagesString = formData.get("existingImages") as string;
    const existingImages = existingImagesString ? existingImagesString.split(',') : [];
    console.log(`[UpdateProduct] Preserving ${existingImages.length} existing images:`, existingImages);
    
    // Handle New Images Upload
    const newProductImages = formData.getAll("productImages") as File[];
    console.log(`[UpdateProduct] Received ${newProductImages.length} new files from form`);
    
    const newImageUrls = await uploadMultipleToCloudinary(newProductImages);
    console.log(`[UpdateProduct] Successfully uploaded ${newImageUrls.length} new images`);
    
    const finalImageUrls = [...existingImages, ...newImageUrls];
    console.log("[UpdateProduct] Final combined images array:", finalImageUrls);
    
    if (finalImageUrls.length === 0) {
        console.error("[UpdateProduct] No images available after combining existing and new");
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
        images: finalImageUrls.join(", "),
        isTrending: formData.get("isTrending") === "on",
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
        images: finalImageUrls,
        isTrending: validatedFields.data.isTrending || false,
        updatedAt: new Date(),
    };

    console.log("[UpdateProduct] Updating database with:", {
        ...updateData,
        images: updateData.images, // Log the array
    });

    try {
        await db.update(products).set(updateData).where(eq(products.id, productId));
        console.log("[UpdateProduct] Database update successful for ID:", productId);

        revalidatePath("/admin/products");
        revalidatePath(`/products/${updateData.slug}`);
        revalidatePath("/");
        console.log("[UpdateProduct] Product updated successfully and cache revalidated");
        return { success: true, message: "Product updated successfully" };
    } catch (error) {
        console.error(`[UpdateProduct] Database update failed for ID ${productId}:`, error);
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

// Helper to detect if slug has a color word AT THE END
function isColorVariant(slug: string): boolean {
    const commonColors = ['black', 'white', 'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'grey', 'gray', 'brown', 'navy', 'maroon', 'olive', 'cyan', 'magenta', 'lime', 'teal', 'violet', 'indigo', 'beige', 'cream', 'tan', 'ivory', 'gold', 'silver', 'bronze', 'copper', 'khaki', 'mint', 'peach', 'coral', 'salmon', 'burgundy', 'crimson', 'scarlet', 'turquoise', 'aqua', 'lavender', 'lilac', 'rose', 'ruby', 'emerald', 'jade', 'amber', 'charcoal', 'slate'];
    const slugLower = slug.toLowerCase();
    // Check if slug ENDS with a color word (with hyphen before it)
    return commonColors.some(color => {
        const regex = new RegExp(`-${color}$`);
        return regex.test(slugLower);
    });
}

// Extract base slug by removing color word from the END
function getBaseSlug(slug: string): string {
    const commonColors = ['black', 'white', 'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'grey', 'gray', 'brown', 'navy', 'maroon', 'olive', 'cyan', 'magenta', 'lime', 'teal', 'violet', 'indigo', 'beige', 'cream', 'tan', 'ivory', 'gold', 'silver', 'bronze', 'copper', 'khaki', 'mint', 'peach', 'coral', 'salmon', 'burgundy', 'crimson', 'scarlet', 'turquoise', 'aqua', 'lavender', 'lilac', 'rose', 'ruby', 'emerald', 'jade', 'amber', 'charcoal', 'slate'];
    const slugLower = slug.toLowerCase();
    
    for (const color of commonColors) {
        // Match color only at the end of slug
        const regex = new RegExp(`-${color}$`, 'i');
        if (regex.test(slugLower)) {
            console.log('[getBaseSlug] Found color at end:', color, 'in slug:', slug);
            // Remove the color word from the end
            const result = slug.replace(regex, '');
            console.log('[getBaseSlug] Result after removal:', result);
            return result;
        }
    }
    console.log('[getBaseSlug] No color found at end of slug:', slug);
    return slug;
}

export async function getProducts() {
    const maxRetries = 3;
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const fetchedProducts = await db.select().from(products).orderBy(desc(products.createdAt));
            // Filter out color variants - only show primary products without color suffix
            return fetchedProducts.filter(p => !isColorVariant(p.slug));
        } catch (error) {
            lastError = error;
            console.error(`Failed to fetch products (attempt ${attempt}/${maxRetries}):`, error);
            
            // If not the last attempt, wait before retrying
            if (attempt < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
            }
        }
    }
    
    console.error("All retry attempts failed:", lastError);
    return [];
}

// Get ALL products including color variants (for admin)
export async function getAllProducts() {
    try {
        const fetchedProducts = await db.select().from(products).orderBy(desc(products.createdAt));
        return fetchedProducts;
    } catch (error) {
        console.error("Failed to fetch all products:", error);
        return [];
    }
}

// Get all color variants for a base product slug
export async function getColorVariants(baseSlug: string) {
    try {
        console.log('[Color Variants] Looking for variants of:', baseSlug);
        const allProducts = await db.select().from(products).orderBy(desc(products.createdAt));
        console.log('[Color Variants] Total products in DB:', allProducts.length);
        
        const base = getBaseSlug(baseSlug);
        console.log('[Color Variants] Base slug extracted:', base);
        
        // Find all products that start with the base slug (including the base itself if it exists)
        const variants = allProducts.filter(p => {
            const pBase = getBaseSlug(p.slug);
            const matches = pBase === base && p.slug !== baseSlug;
            if (matches) {
                console.log('[Color Variants] Found variant:', p.slug, '(base:', pBase, ')');
            }
            return matches;
        });
        
        console.log('[Color Variants] Total variants found:', variants.length);
        return variants;
    } catch (error) {
        console.error("Failed to fetch color variants:", error);
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
