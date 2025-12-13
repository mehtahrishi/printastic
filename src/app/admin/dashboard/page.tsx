import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { SalesChart } from "@/components/admin/sales-chart";
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
import { ClientOnly } from "@/components/client-only";
import { SalesChartClient } from "@/components/admin/sales-chart-client";

export default function DashboardPage() {
    const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
    const totalSales = orders.length;
    const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          description="+20.1% from last month"
          icon={DollarSign}
        />
        <StatCard
          title="Sales"
          value={`+${totalSales.toLocaleString()}`}
          description="+180.1% from last month"
          icon={ShoppingCart}
        />
        <StatCard
          title="New Customers"
          value="+5"
          description="+19% from last month"
          icon={Users}
        />
        <StatCard
          title="Products"
          value="12"
          description="Total products available"
          icon={Package}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
            <ClientOnly>
                <SalesChartClient />
            </ClientOnly>
        </div>
        <div className="lg:col-span-3">
            <Card>
                <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>You have {orders.length} total orders.</CardDescription>
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
                            <div className="text-sm text-muted-foreground">
                                {order.customerEmail}
                            </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'}>
                                    {order.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
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
