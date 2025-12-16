import { notFound } from "next/navigation";
import { getProduct } from "@/app/actions/products";
import { ProductDetailClient } from "@/components/products/product-detail-client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // Ensure we have an integer ID
  const productId = parseInt(params.id);
  if (isNaN(productId)) {
    notFound();
  }

  const product = await getProduct(productId);

  if (!product) {
    notFound();
  }

  // Convert basic product to the type expected by client (handling nulls if necessary)
  const formattedProduct = {
    ...product,
    price: Number(product.price),
    originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
    sizes: product.sizes as string[] || [],
    colors: product.colors as string[] || [],
    images: (() => {
      if (!product.images) return [];
      if (Array.isArray(product.images)) return product.images;
      if (typeof product.images === 'string') {
        try {
          const parsed = JSON.parse(product.images);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return (product.images as string).split(',').map((s: string) => s.trim()).filter(Boolean);
        }
      }
      return [];
    })()
  };

  return (
    <div className="container py-8 md:py-12">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Products</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <ProductDetailClient product={formattedProduct} />
    </div>
  );
}
