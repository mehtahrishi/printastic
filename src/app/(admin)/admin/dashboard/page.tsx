

import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { orders } from "@/lib/data";

import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { OrdersRevenueChart } from "@/components/admin/orders-revenue-chart";

import { getProductsCount } from "@/app/actions/products";
import { Order } from "@/lib/types";

// Helper function to process orders for the chart
const processOrderDataForChart = (orders: Order[]) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyData = new Map<string, { orders: number, revenue: number }>();

    // Initialize the last 12 months
    const today = new Date();
    for (let i = 11; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthKey = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
        if (!monthlyData.has(monthKey)) {
            monthlyData.set(monthKey, { orders: 0, revenue: 0 });
        }
    }

    // Process orders from the last year
    orders.forEach(order => {
        const orderDate = new Date(order.date);
        const yearDiff = today.getFullYear() - orderDate.getFullYear();
        const monthDiff = (yearDiff * 12) + (today.getMonth() - orderDate.getMonth());
        
        if (monthDiff < 12) {
            const monthKey = `${monthNames[orderDate.getMonth()]} ${orderDate.getFullYear()}`;
            if (monthlyData.has(monthKey)) {
                const current = monthlyData.get(monthKey)!;
                current.orders += 1;
                current.revenue += order.total;
            }
        }
    });

    // Format for chart
    return Array.from(monthlyData.entries()).map(([month, data]) => ({
        month: month.split(' ')[0], // Just the month name for the label
        orders: data.orders,
        revenue: data.revenue
    })).slice(-12);
};


export default async function DashboardPage() {
    // Fetch total customer count
    const customerCount = await db.select().from(users).then(res => res.length);

    // Fetch active products count
    const activeProductsCount = await getProductsCount(true);

    // Basic stats calculation
    const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
    const totalSales = orders.length;

    // Most recent 5 orders
    const recentOrders = orders.slice(0, 5);

    // Process data for the chart
    const chartData = processOrderDataForChart(orders);


    return (
        <div className="container py-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">Overview of your store's performance.</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Revenue"
                    value={`₹${totalRevenue.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}`}
                    description="+20.1% from last month"
                    icon={DollarSign}
                />
                <StatCard
                    title="Total Orders"
                    value={totalSales.toLocaleString()}
                    description="All-time order count"
                    icon={ShoppingCart}
                />
                <StatCard
                    title="Total Customers"
                    value={customerCount.toString()}
                    description="All registered users"
                    icon={Users}
                />
                <StatCard
                    title="Active Products"
                    value={activeProductsCount.toString()}
                    description="Inventory status"
                    icon={Package}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
                <div className="lg:col-span-4">
                    <OrdersRevenueChart data={chartData} />
                </div>

                <div className="lg:col-span-3">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Recent Orders</CardTitle>
                            <CardDescription>Latest {recentOrders.length} orders from your store.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentOrders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell>
                                                <div className="font-medium">{order.customerName}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {order.customerEmail}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={order.status === 'Delivered' ? 'default' : 'secondary'}
                                                    className="text-xs"
                                                >
                                                    {order.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                ₹{order.total.toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
