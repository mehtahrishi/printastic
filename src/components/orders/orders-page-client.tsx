
"use client";

import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";

const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
        case 'delivered':
            return 'bg-green-100 text-green-800 border-green-200';
        case 'shipped':
        case 'on the way':
        case 'out for delivery':
            return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'processing':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'cancelled':
        case 'rejected':
            return 'bg-red-100 text-red-800 border-red-200';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};


export function OrdersPageClient({ orders, fromCheckout }: { orders: any[], fromCheckout: boolean }) {
    const { toast } = useToast();

    useEffect(() => {
        if (fromCheckout) {
            toast({
                title: "Invoice Sent",
                description: "An invoice has been sent to your email.",
            });
            // Clean the URL to prevent toast on refresh
            window.history.replaceState(null, '', '/orders');
        }
    }, [fromCheckout, toast]);
    

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
                <div>
                    {/* Mobile View: Cards */}
                    <div className="space-y-6 md:hidden">
                        {orders.map((order) => (
                             <Card key={order.id} className="overflow-hidden">
                                <CardHeader className="p-4 bg-muted/30 border-b">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                                            <CardDescription className="text-xs">{new Date(order.createdAt).toLocaleDateString()}</CardDescription>
                                        </div>
                                        <Badge variant="outline" className={cn("text-xs capitalize mt-1", getStatusClass(order.status))}>
                                            {order.status}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 space-y-4">
                                    <div className="space-y-2">
                                         {order.items?.map((item: any, index: number) => {
                                            const details = [
                                                item.quantity && `${item.quantity}x`,
                                                item.size,
                                                item.color,
                                            ].filter(Boolean).join(' / ');

                                            return (
                                                <div key={index} className="flex justify-between items-start text-sm">
                                                    <span className="text-foreground truncate pr-4">{item.product.name} {details && `(${details})`}</span>
                                                    <span className="font-medium text-right shrink-0">₹{Number(item.price).toFixed(2)}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </CardContent>
                                <CardFooter className="p-4 bg-muted/30 border-t">
                                     {order.paymentMethod === 'cod' && order.status !== 'Delivered' ? (
                                        <div className="w-full space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Total:</span>
                                                <span className="font-semibold text-foreground">₹{Number(order.total).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-green-600">
                                                <span className="text-muted-foreground">Paid:</span>
                                                <span>₹50.00</span>
                                            </div>
                                            <div className="flex justify-between text-red-600">
                                                <span className="text-muted-foreground">Due:</span>
                                                <span>₹{(Number(order.total) - 50).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex justify-between w-full items-center">
                                            <span className="text-muted-foreground text-sm">Total Paid</span>
                                            <span className="font-bold text-lg">₹{Number(order.total).toFixed(2)}</span>
                                        </div>
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    {/* Desktop View: Table */}
                    <div className="hidden md:block">
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
                                                <TableHead>Payment</TableHead>
                                                <TableHead className="text-right">Total</TableHead>
                                                <TableHead className="text-center">Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {orders.map((order) => (
                                                <TableRow key={order.id}>
                                                    <TableCell className="font-medium">#{order.id}</TableCell>
                                                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                                    <TableCell className="text-muted-foreground max-w-xs">
                                                        {(!order.items || order.items.length === 0) ? (
                                                            "No items"
                                                        ) : (
                                                            <div className="flex flex-col gap-1">
                                                                {order.items.map((item: any, index: number) => {
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
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="capitalize text-muted-foreground">{order.paymentMethod}</TableCell>
                                                    <TableCell className="text-right font-medium">
                                                        {order.paymentMethod === 'cod' && order.status !== 'Delivered' ? (
                                                            <div className="flex flex-col items-end gap-0.5">
                                                                <div className="flex justify-between w-36 text-xs">
                                                                    <span className="text-muted-foreground">Total:</span>
                                                                    <span className="font-semibold text-foreground">₹{Number(order.total).toFixed(2)}</span>
                                                                </div>
                                                                <div className="flex justify-between w-36 text-xs text-green-600">
                                                                    <span className="text-muted-foreground">Paid:</span>
                                                                    <span>₹50.00</span>
                                                                </div>
                                                                <div className="flex justify-between w-36 text-xs text-red-600">
                                                                    <span className="text-muted-foreground">Due:</span>
                                                                    <span>₹{(Number(order.total) - 50).toFixed(2)}</span>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span>₹{Number(order.total).toFixed(2)}</span>
                                                        )}
                                                    </TableCell>
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
                    </div>
                </div>
            )}
        </div>
    );
}
