"use client";

import Link from "next/link";
import { ShoppingCart, Heart, Brush, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { SVGProps } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const tShirtIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
  </svg>
);

const navItems = [
  {
    name: "Hoodies",
    href: "/category/hoodies",
    icon: (props: SVGProps<SVGSVGElement>) => (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2a4.5 4.5 0 0 0-4.5 4.5V11H4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2h-3.5V6.5A4.5 4.5 0 0 0 12 2zM9 11v- necesidades" />
        <path d="M15 11V6.5" />
        <path d="M10 16h4" />
      </svg>
    ),
  },
  {
    name: "Water Bottles",
    href: "/category/water-bottles",
    icon: (props: SVGProps<SVGSVGElement>) => (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="currentColor"
      >
        <path d="M14 2H10V5L7 9V19C7 20.66 8.34 22 10 22H14C15.66 22 17 20.66 17 19V9L14 5V2Z" />
      </svg>
    ),
  },
  {
    name: "Cushions",
    href: "/category/cushions",
    icon: (props: SVGProps<SVGSVGElement>) => (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.5"
      >
        <path d="M2 12.88V19a2 2 0 002 2h16a2 2 0 002-2v-6.12a2 2 0 00-2-2H4a2 2 0 00-2 2z" />
        <path d="M4 10.88V6a2 2 0 012-2h12a2 2 0 012 2v4.88a2 2 0 01-2 2H6a2 2 0 01-2-2z" />
        <path
          d="M17.82 2.65A2 2 0 0016 2H8a2 2 0 00-1.82.65L3 7.18V10h18V7.18l-3.18-4.53z"
          stroke="none"
        />
      </svg>
    ),
  },
];

export function Header() {
  const { itemCount: cartItemCount } = useCart();
  const { itemCount: wishlistItemCount } = useWishlist();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <Brush className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">Printastic</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div
                className="flex flex-col items-center text-foreground/60 transition-colors hover:text-foreground/80 cursor-pointer"
              >
                <div className="flex items-center">
                  {tShirtIcon({ className: "h-6 w-6 mb-1" })}
                </div>
                <div className="flex items-center">
                  <span>T-Shirts</span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link href="/category/t-shirts">All T-Shirts</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/category/oversize-t-shirt">Oversize T-Shirts</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/category/kids-t-shirts">Kids T-Shirts</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center text-foreground/60 transition-colors hover:text-foreground/80"
            >
              <item.icon className="h-6 w-6 mb-1" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/wishlist">
              <Heart className="h-5 w-5" />
              {wishlistItemCount > 0 && (
                <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs">
                  {wishlistItemCount}
                </span>
              )}
              <span className="sr-only">Wishlist</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                  {cartItemCount}
                </span>
              )}
              <span className="sr-only">Shopping Cart</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
