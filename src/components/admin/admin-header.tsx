"use client";

import Link from "next/link";
import {
    Menu,
    UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { sidebarItems } from "./admin-sidebar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function AdminHeader({ isLoggedIn }: { isLoggedIn: boolean }) {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-20 items-center justify-between relative">

                {/* Left Side: Mobile Sidebar Menu Trigger */}
                <div className="flex items-center md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="-ml-2">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-72 sm:w-80">
                            <SheetHeader>
                                <SheetTitle className="sr-only">Admin Menu</SheetTitle>
                                <div className="flex items-center gap-2 text-2xl">
                                    <Logo className="w-auto h-auto" />
                                </div>
                            </SheetHeader>
                            <div className="mt-6 flex flex-col gap-2">
                                {isLoggedIn ? (
                                    <>
                                        <div className="mb-4">
                                            <h3 className="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground">
                                                Menu
                                            </h3>
                                            <div className="flex flex-col gap-1">
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
                                        </div>
                                    </>
                                ) : (
                                    <Link href="/admin/login" className="text-sm text-foreground/80 hover:text-foreground p-2 rounded-md hover:bg-accent">
                                        Admin Login
                                    </Link>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Left Side: Desktop Logo (Hidden on mobile to preserve layout logic, or we can unify) */}
                <div className="hidden md:flex items-center pt-4 pb-0 -ml-12">
                    <Link href="/" className="flex items-center gap-2 text-xl md:text-2xl">
                        <Logo className="w-auto h-auto" />
                    </Link>
                </div>

                {/* Center: Mobile Logo (Absolute) */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden scale-75 origin-center">
                    <Link href="/" className="flex items-center gap-2">
                        <Logo className="w-auto h-auto" />
                    </Link>
                </div>

                {/* Right Side: Account Icon (Mobile & Desktop) */}
                <div className="flex items-center justify-end gap-2">
                    {isLoggedIn && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="">
                                    <UserRound className="h-5 w-5" />
                                    <span className="sr-only">Admin Account</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/signout">Sign out</Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>
        </header>
    );
}
