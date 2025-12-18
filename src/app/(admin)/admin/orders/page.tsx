
import { db } from "@/lib/db";
import { orders, users, orderItems, products } from "@/db/schema";
import { eq, desc, inArray, or, like } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SearchInput } from "@/components/admin/search-input";
import { OrderStatusChanger } from "@/components/admin/orders/order-status-changer";

async function getAllOrders(query: string) {
    try {
        let allOrdersQuery = db
            .select({
                order: orders,
                user: {
                    name: users.name,
                    email: users.email
                }
            })
            .from(orders)
            .innerJoin(users, eq(orders.userId, users.id))
            .orderBy(desc(orders.createdAt));

        if (query) {
            const likeQuery = `%${query}%`;
            allOrdersQuery = allOrdersQuery.where(or(
                like(users.name, likeQuery),
                like(users.email, likeQuery),
                like(orders.status, likeQuery)
            ));
        }

        const allOrders = await allOrdersQuery;

        if (allOrders.length === 0) {
            return [];
        }

        const orderIds = allOrders.map(o => o.order.id);
        
        const allOrderItems = await db.select({
            orderId: orderItems.orderId,
            quantity: orderItems.quantity,
            price: orderItems.price,
            size: orderItems.size,
            color: orderItems.color,
            product: {
                name: products.name,
            }
        })
        .from(orderItems)
        .innerJoin(products, eq(orderItems.productId, products.id))
        .where(inArray(orderItems.orderId, orderIds));

        const ordersWithDetails = allOrders.map(({ order, user }) => {
            const items = allOrderItems.filter(item => item.orderId === order.id);
            return {
                ...order,
                customerName: user.name,
                customerEmail: user.email,
                items,
            };
        });

        return ordersWithDetails;

    } catch (error) {
        console.error("Error fetching all orders:", error);
        return [];
    }
}


export default async function OrdersPage({
    searchParams
}: {
    searchParams?: { [key: string]: string | string[] | undefined };
}) {

    const query = typeof searchParams?.query === 'string' ? searchParams.query : '';
    const allOrders = await getAllOrders(query);

    return (
        <div className="container py-8 space-y-6">
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                <SearchInput placeholder="Search by customer, email, or status..." />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Customer Orders</CardTitle>
                    <CardDescription>A list of all orders placed on your store.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Items</TableHead>
                                    <TableHead>Payment</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {allOrders.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center">
                                            No orders found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    allOrders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-medium">#{order.id}</TableCell>
                                            <TableCell>
                                                <div className="font-medium">{order.customerName}</div>
                                                <div className="text-sm text-muted-foreground">{order.customerEmail}</div>
                                            </TableCell>
                                            <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-muted-foreground max-w-xs">
                                                <div className="flex flex-col gap-1">
                                                    {order.items.map((item, index) => {
                                                         const details = [
                                                            item.quantity && `${item.quantity}x`,
                                                            item.size,
                                                            item.color,
                                                        ].filter(Boolean).join(' / ');
                                                        return (
                                                            <div key={index}>
                                                                <span className="text-foreground truncate">{item.product.name}</span>
                                                                {details && <span className="text-xs ml-2">({details})</span>}
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </TableCell>
                                            <TableCell className="capitalize text-muted-foreground">{order.paymentMethod}</TableCell>
                                             <TableCell className="text-right font-medium">
                                                {order.paymentMethod === 'cod' ? (
                                                    <div className="flex flex-col items-end text-xs">
                                                        <div className="flex justify-between w-32">
                                                            <span className="text-muted-foreground">Total:</span>
                                                            <span className="font-bold text-foreground">₹{Number(order.total).toFixed(2)}</span>
                                                        </div>
                                                        <div className="flex justify-between w-32 text-green-600">
                                                            <span className="text-muted-foreground">Paid:</span>
                                                            <span>₹50.00</span>
                                                        </div>
                                                        <div className="flex justify-between w-32 text-red-600">
                                                            <span className="text-muted-foreground">Due:</span>
                                                            <span>₹{(Number(order.total) - 50).toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span>₹{Number(order.total).toFixed(2)}</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <OrderStatusChanger orderId={order.id} currentStatus={order.status} />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
