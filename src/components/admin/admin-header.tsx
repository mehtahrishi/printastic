"use client";

import Link from "next/link";
import {
    Menu,
    UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { useState } from "react";
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

export function AdminHeader({ isLoggedIn }: { isLoggedIn: boolean }) {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-18 items-center justify-between">
                <Link href="/" className="flex items-center gap-2 mr-6 md:mr-12 text-xl md:text-2xl pt-3 md:-ml-10 mx-auto md:mx-0">
                    <Logo className="w-auto h-auto" />
                </Link>

                {/* Desktop Admin Menu */}
                <div className="hidden md:flex flex-1 items-center justify-end gap-2">
                    {isLoggedIn && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="hidden md:flex">
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

                {/* Mobile Sidebar Menu (Admin Version) */}
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-72 sm:w-80">
                            <SheetHeader>
                                <SheetTitle className="sr-only">Admin Menu</SheetTitle>
                                <div className="flex items-center gap-2 text-2xl">
                                    <Logo className="w-auto h-auto" />
                                </div>
                            </SheetHeader>
                            <div className="mt-6 flex flex-col gap-2">
                                {isLoggedIn ? (
                                    <>
                                        <div className="flex flex-col gap-2 p-2 rounded-md hover:bg-accent">
                                            <span className="text-sm font-medium text-muted-foreground">Admin Account</span>
                                        </div>
                                        <Link
                                            href="/signout"
                                            className="text-sm text-foreground/80 hover:text-foreground p-2 rounded-md hover:bg-accent"
                                        >
                                            Sign out
                                        </Link>
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
            </div>
        </header>
    );
}
