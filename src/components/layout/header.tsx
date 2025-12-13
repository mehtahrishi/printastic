"use client";

import Link from "next/link";
import { ShoppingCart, Heart, Brush } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { SVGProps } from "react";

const navItems = [
  {
    name: "T-Shirts",
    href: "/category/t-shirts",
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
        <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
      </svg>
    ),
  },
  {
    name: "Oversize T-Shirt",
    href: "/category/oversize-t-shirt",
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
            strokeLinejoin="round">
            <path d="M21.54 6.24a2.3 2.3 0 0 0-1.9-1.94 2.3 2.3 0 0 0-2.31.24l-1.33 1a3 3 0 0 1-3.79.2L8.2 3.54a2 2 0 0 0-2.4 0L2.2 6.54a2 2 0 0 0 0 2.8l2.9 2.9a1 1 0 0 0 1.41 0l1.2-1.2a1 1 0 0 1 1.41 0l2.12 2.12a1 1 0 0 1 0 1.41L9 17.18a1 1 0 0 0 0 1.41l2.9 2.9a2 2 0 0 0 2.8 0l6.54-6.54a2 2 0 0 0 0-2.8Z"/>
        </svg>
    ),
  },
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
    name: "Kids T-Shirts",
    href: "/category/kids-t-shirts",
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
            strokeLinejoin="round">
           <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>
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
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 5h4" />
        <path d="M8 5a2 2 0 0 1-2-2h12a2 2 0 0 1-2 2" />
        <path d="M12 18H8a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-4" />
        <path d="m14 12-4 4" />
        <path d="m10 12 4 4" />
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
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2.5 8.5v8a2 2 0 0 0 2 2h15a2 2 0 0 0 2-2v-8" />
        <path d="M2.5 12.5v-4a2 2 0 0 1 2-2h15a2 2 0 0 1 2 2v4" />
        <path d="M21.5 12.5v-4a2 2 0 0 0-2-2h-15a2 2 0 0 0-2 2v4" />
        <path d="M21.5 8.5v-4a2 2 0 0 0-2-2h-15a2 2 0 0 0-2 2v4" />
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
