import { notFound } from "next/navigation";
import { getProduct, getProductPreviews } from "@/app/actions/products";
import { ProductDetailClient } from "@/components/products/product-detail-client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

function parseJsonOrString(data: any): string[] {
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') {
        try {
            // First, try to parse it as JSON
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed)) return parsed;
        } catch (e) {
            // If it's not a valid JSON string, treat it as a comma-separated string
            return data.split(',').map(s => s.trim()).filter(Boolean);
        }
    }
    return [];
}


export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // The slug is passed as 'id', so we decode it
  const slug = decodeURIComponent(params.id);
  
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const previews = await getProductPreviews(product.id as number);

  // Convert basic product to the type expected by client
  const formattedProduct = {
    ...product,
    price: Number(product.price),
    originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
    sizes: parseJsonOrString(product.sizes),
    colors: parseJsonOrString(product.colors),
    images: parseJsonOrString(product.images),
    previews: previews.map(p => ({
      id: p.id.toString(),
      imageUrl: p.imageUrl,
      setting: p.setting,
      imageHint: p.imageHint || undefined
    }))
  };

  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;
  const user = userId ? await db.select({ name: users.name }).from(users).where(eq(users.id, parseInt(userId))).then(res => res[0] || null) : null;

  return (
    <div className="container py-8 md:py-12">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/products">Products</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <ProductDetailClient product={formattedProduct} user={user} />
    </div>
  );
}
