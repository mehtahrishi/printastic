
import { getOrders } from "@/actions/orders";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
        case 'delivered':
            return 'bg-green-100 text-green-800 border-green-200';
        case 'shipped':
            return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'processing':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'cancelled':
            return 'bg-red-100 text-red-800 border-red-200';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

export default async function OrdersPage() {
    const orders = await getOrders();

    const getItemSummary = (items: any[]) => {
        if (!items || items.length === 0) return "No items";
        const firstItemName = items[0].product.name;
        const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

        if (totalItems === 1) {
            return firstItemName;
        }
        
        const otherItemsCount = totalItems - items[0].quantity;

        if (otherItemsCount > 0) {
           return `${firstItemName} + ${otherItemsCount} other item(s)`;
        }
        return firstItemName;
    }


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
                 <Card>
                    <CardHeader>
                        <CardTitle>Your Order History</CardTitle>
                        <CardDescription>A summary of all your past orders.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order ID</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Items</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                        <TableHead className="text-center">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-medium">#{order.id}</TableCell>
                                            <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {getItemSummary(order.items)}
                                            </TableCell>
                                            <TableCell className="text-right font-medium">₹{order.total}</TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="outline" className={cn("text-xs capitalize", getStatusClass(order.status))}>
                                                    {order.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
