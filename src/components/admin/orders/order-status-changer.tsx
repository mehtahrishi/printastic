"use client";

import { useState, useTransition } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { updateOrderStatus } from "@/actions/orders";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const statuses = [
    "Processing",
    "On the way",
    "Out for delivery",
    "Delivered",
    "Rejected",
    "On hold",
];

const statusColors: Record<string, string> = {
    'Delivered': 'bg-green-100 text-green-800 border-green-200',
    'On the way': 'bg-blue-100 text-blue-800 border-blue-200',
    'Shipped': 'bg-blue-100 text-blue-800 border-blue-200',
    'Processing': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Out for delivery': 'bg-orange-100 text-orange-800 border-orange-200',
    'Rejected': 'bg-red-100 text-red-800 border-red-200',
    'Cancelled': 'bg-red-100 text-red-800 border-red-200',
    'On hold': 'bg-gray-100 text-gray-800 border-gray-200',
    'Pending': 'bg-gray-100 text-gray-800 border-gray-200',
};

const getStatusClass = (status: string) => {
    return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};

interface OrderStatusChangerProps {
    orderId: number;
    currentStatus: string;
}

export function OrderStatusChanger({ orderId, currentStatus }: OrderStatusChangerProps) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    
    const handleStatusChange = (newStatus: string) => {
        if (newStatus === currentStatus) return;

        startTransition(async () => {
            const result = await updateOrderStatus(orderId, newStatus);
            if (result.success) {
                toast({
                    title: "Status Updated",
                    description: result.message,
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: result.error,
                });
            }
        });
    };

    return (
        <div className="flex items-center justify-center gap-2">
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            <Select
                defaultValue={currentStatus}
                onValueChange={handleStatusChange}
                disabled={isPending}
            >
                <SelectTrigger className={cn(
                    "h-8 text-xs capitalize border-none focus:ring-0 focus:ring-offset-0",
                    getStatusClass(currentStatus)
                )}>
                    <SelectValue placeholder="Change status" />
                </SelectTrigger>
                <SelectContent>
                    {statuses.map(status => (
                        <SelectItem key={status} value={status} className="capitalize">
                            {status}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
