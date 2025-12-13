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
        version="1.1"
        id="Capa_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 60 60"
        fill="currentColor"
      >
        <g>
          <g>
            <path d="M43.977,17.987c0.158-0.998-0.127-2.01-0.783-2.778C42.537,14.44,41.581,14,40.571,14h-1.76v-2h1c0.553,0,1-0.448,1-1 c0-2.757-2.243-5-5-5h-3V5.347C32.812,5.156,32.967,5,33.158,5h0.653c0.553,0,1-0.448,1-1V1c0-0.552-0.447-1-1-1h-7 c-0.553,0-1,0.448-1,1v3c0,0.552,0.447,1,1,1h0.653c0.191,0,0.347,0.156,0.347,0.347V6h-3c-2.757,0-5,2.243-5,5 c0,0.552,0.447,1,1,1h1v2h-2.385c-1.01,0-1.966,0.44-2.622,1.209c-0.656,0.768-0.941,1.78-0.78,2.796l1.8,10.151 c0.507,3.212,0.718,6.54,0.645,9.844l0,0l0,0c-0.049,2.188-0.219,4.366-0.522,6.493l-1.143,6.793 c-0.33,2.31,0.396,4.611,1.994,6.314c1.446,1.544,3.429,2.4,5.514,2.4c0.196,0,0.395-0.008,0.592-0.023 c3.482-0.271,6.914-0.3,10.199-0.088c2.325,0.148,4.557-0.74,6.132-2.442c1.563-1.69,2.273-3.968,1.95-6.228l-0.807-6.7 c-0.305-2.139-0.476-4.324-0.525-6.518l0,0l0,0c-0.074-3.309,0.138-6.637,0.646-9.856L43.977,17.987z M27.812,2h5v1.025 c-1.13,0.168-2,1.145-2,2.321V6h-1V5.347c0-1.176-0.87-2.153-2-2.321V2z M24.812,8h4h3h4c1.304,0,2.416,0.836,2.829,2H21.983 C22.396,8.836,23.508,8,24.812,8z M36.812,12v2h-13v-2H36.812z M39.766,56.088c-1.163,1.258-2.811,1.919-4.534,1.805 c-3.379-0.218-6.907-0.188-10.482,0.09c-1.689,0.126-3.327-0.507-4.492-1.75c-1.18-1.258-1.717-2.958-1.477-4.639L19.553,47 h21.109l0.539,4.48C41.443,53.163,40.919,54.843,39.766,56.088z M39.883,39c0.026,0.669,0.062,1.335,0.111,2H20.326 c0.049-0.665,0.085-1.332,0.111-2H39.883z M20.452,35h19.415c-0.02,0.667-0.029,1.333-0.026,2H20.479 C20.481,36.333,20.472,35.667,20.452,35z M39.962,33H20.358c-0.043-0.669-0.098-1.335-0.164-2h19.932 C40.06,31.664,40.005,32.331,39.962,33z M40.176,43c0.065,0.596,0.135,1.19,0.219,1.779L40.421,45H19.89l0.033-0.199 c0.085-0.596,0.156-1.198,0.222-1.801H40.176z M40.362,29H19.959c-0.053-0.392-0.101-0.785-0.163-1.174L19.65,27h20.995 l-0.123,0.844C40.461,28.227,40.414,28.614,40.362,29z M42,17.687L40.936,25H19.295l-1.299-7.326 c-0.066-0.419,0.054-0.844,0.329-1.167C18.602,16.185,19.003,16,19.427,16h2.385h17h1.76c0.424,0,0.825,0.185,1.102,0.508 C41.948,16.83,42.069,17.255,42,17.687z" />
          </g>
        </g>
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
