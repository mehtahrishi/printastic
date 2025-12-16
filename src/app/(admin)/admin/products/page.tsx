import { Suspense } from "react";
import { getProducts } from "@/app/actions/products";
import { ProductsTable } from "@/components/admin/products/products-table";
import { CreateProductButton } from "@/components/admin/products/create-product-button";
import { Skeleton } from "@/components/ui/skeleton";

export default async function ProductsPage() {
    const products = await getProducts(true);

    return (
        <div className="container py-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                    <p className="text-muted-foreground">Manage your product inventory.</p>
                </div>
                <CreateProductButton />
            </div>

            <Suspense fallback={<ProductTableSkeleton />}>
                <ProductsTable products={products as any[]} />
            </Suspense>
        </div>
    );
}

function ProductTableSkeleton() {
    return (
        <div className="space-y-4">
            <div className="border rounded-md p-4">
                <div className="space-y-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                </div>
            </div>
        </div>
    );
}
