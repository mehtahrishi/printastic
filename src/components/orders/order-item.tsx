"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, Package } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Order = {
  id: number;
  total: string;
  status: string;
  paymentMethod: string;
  createdAt: Date;
  items: OrderItemType[];
};

type OrderItemType = {
  quantity: number;
  price: string;
  size: string | null;
  color: string | null;
  product: {
    name: string;
    slug: string;
    images: string[];
  };
};

function getFirstImage(images: any): string {
    if (!images) return '/placeholder.jpg';
    if (Array.isArray(images)) return images[0] || '/placeholder.jpg';
    if (typeof images === 'string') {
      try {
        const parsed = JSON.parse(images);
        return Array.isArray(parsed) ? parsed[0] || '/placeholder.jpg' : '/placeholder.jpg';
      } catch {
        const urls = images.split(',').map(u => u.trim()).filter(Boolean);
        return urls[0] || '/placeholder.jpg';
      }
    }
    return '/placeholder.jpg';
};

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

export function OrderItem({ order }: { order: Order }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Card className="overflow-hidden">
            <CardHeader className="p-4 bg-muted/50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="grid gap-1 text-sm">
                        <p className="font-semibold">Order ID: #{order.id}</p>
                        <p className="text-muted-foreground">
                            Date: {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Badge variant="outline" className={cn("text-xs", getStatusClass(order.status))}>{order.status}</Badge>
                        <p className="font-semibold text-lg">₹{order.total}</p>
                    </div>
                </div>
            </CardHeader>
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-4">
                            {order.items.slice(0, 3).map((item, index) => {
                                const imageUrl = getFirstImage(item.product.images);
                                return (
                                    <div key={index} className="relative h-12 w-12 rounded-full border-2 border-background bg-muted overflow-hidden">
                                        <Image src={imageUrl} alt={item.product.name} fill className="object-cover" />
                                    </div>
                                );
                            })}
                            {order.items.length > 3 && (
                                <div className="flex items-center justify-center h-12 w-12 rounded-full border-2 border-background bg-primary/10 text-primary text-xs font-semibold">
                                    +{order.items.length - 3}
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="font-medium">
                                {order.items[0].product.name}
                                {order.items.length > 1 && ` and ${order.items.length - 1} other item(s)`}
                            </p>
                        </div>
                         <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm">
                                View Details
                                <ChevronDown className={cn("ml-2 h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                            </Button>
                        </CollapsibleTrigger>
                    </div>
                </CardContent>

                <CollapsibleContent>
                    <div className="px-4 pb-4">
                        <Separator className="my-4"/>
                        <div className="space-y-4">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex items-start gap-4">
                                     <div className="relative h-16 w-16 rounded-md border bg-muted overflow-hidden">
                                        <Image src={getFirstImage(item.product.images)} alt={item.product.name} fill className="object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold">{item.product.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {item.quantity} x ₹{item.price}
                                            {(item.size || item.color) && ` | ${item.size || ''}${item.size && item.color ? '/' : ''}${item.color || ''}`}
                                        </p>
                                    </div>
                                    <p className="font-medium">₹{(item.quantity * parseFloat(item.price)).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                        <Separator className="my-4"/>
                        <div className="flex justify-end gap-6 text-sm">
                            <div>
                                <p className="text-muted-foreground">Payment</p>
                                <p className="font-medium capitalize">{order.paymentMethod}</p>
                            </div>
                             <div>
                                <p className="text-muted-foreground">Total</p>
                                <p className="font-bold text-base">₹{order.total}</p>
                            </div>
                        </div>
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
}
