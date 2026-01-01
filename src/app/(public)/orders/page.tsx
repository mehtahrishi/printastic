

import { getOrders } from "@/actions/orders";
import { Suspense } from "react";
import { OrdersPageClient } from "@/components/orders/orders-page-client";


export default async function OrdersPage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const orders = await getOrders();
    const params = await searchParams;
    const fromCheckout = params?.from === 'checkout';

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OrdersPageClient orders={orders} fromCheckout={fromCheckout} />
        </Suspense>
    );
}

