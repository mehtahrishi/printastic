import { Suspense } from "react";
import { getProducts } from "@/app/actions/products";
import { ProductsTable } from "@/components/admin/products/products-table";
import { CreateProductButton } from "@/components/admin/products/create-product-button";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchInput } from "@/components/admin/search-input";

export default async function ProductsPage({
    searchParams
}: {
    searchParams?: { query?: string };
}) {
    const allProducts = await getProducts(true);
    const query = searchParams?.query?.toLowerCase() || '';

    const filteredProducts = allProducts.filter(product => 
        product.name.toLowerCase().includes(query)
    );

    return (
        <div className="container py-8 space-y-8">
            <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                    <p className="text-muted-foreground">Manage your product inventory.</p>
                </div>
                <CreateProductButton />
            </div>

            <div className="flex justify-between items-center">
                 <SearchInput placeholder="Search products by name..." />
            </div>

            <Suspense fallback={<ProductTableSkeleton />}>
                <ProductsTable products={filteredProducts as any[]} />
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
