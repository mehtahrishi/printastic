"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    ShoppingBag,
    Users,
    Package,
    Star,
} from "lucide-react";

export const sidebarItems = [
    {
        name: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "Orders",
        href: "/admin/orders",
        icon: ShoppingBag,
    },
    {
        name: "Customers",
        href: "/admin/customers",
        icon: Users,
    },
    {
        name: "Products",
        href: "/admin/products",
        icon: Package,
    },
    {
        name: "Reviews",
        href: "/admin/reviews",
        icon: Star,
    },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:block min-h-[calc(100vh-4.5rem)] sticky top-18">
            <div className="flex flex-col gap-2 p-4">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                        </Link>
                    );
                })}
            </div>
        </aside>
    );
}
