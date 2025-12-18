
import { getOrders } from "@/actions/orders";
import { OrderItem } from "@/components/orders/order-item";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function OrdersPage() {
    const orders = await getOrders();

    return (
        <div className="container py-12 md:py-16">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">My Orders</h1>

            {orders.length === 0 ? (
                <Card className="text-center py-20 bg-muted/20 border-dashed">
                    <CardContent>
                        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                        <h2 className="text-2xl font-semibold mb-2">No orders yet</h2>
                        <p className="text-muted-foreground mb-6">You haven't placed any orders with us yet.</p>
                        <Button asChild>
                            <Link href="/">Start Shopping</Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <OrderItem key={order.id} order={order as any} />
                    ))}
                </div>
            )}
        </div>
    );
}
