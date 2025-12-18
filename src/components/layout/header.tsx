
"use client";

import Link from "next/link";
import {
  ShoppingCart,
  Heart,
  Brush,
  Sun,
  Moon,
  Menu,
  UserRound,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { SVGProps, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "../ui/toast";
import { useRouter } from "next/navigation";

const OversizeTShirtIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
  </svg>
);

const KidsTShirtIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      d="M9 5h-.16667c-.86548 0-1.70761.28071-2.4.8L3.5 8l2 3.5L8 10v9h8v-9l2.5 1.5 2-3.5-2.9333-2.2c-.6924-.51929-1.5346-.8-2.4-.8H15M9 5c0 1.5 1.5 3 3 3s3-1.5 3-3M9 5h6"
    />
  </svg>
);

const RegularTShirtIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg 
    {...props}
    fill="currentColor" 
    width="24" 
    height="24" 
    version="1.1" 
    id="Icons" 
    xmlns="http://www.w3.org/2000/svg" 
    xmlnsXlink="http://www.w3.org/1999/xlink" 
    viewBox="0 0 32 32" 
    xmlSpace="preserve">
    <path d="M29.7,10.3l-3.7-3.7c-1.7-1.7-4-2.6-6.4-2.6h-0.2c-0.4,0-0.7,0.2-0.9,0.5C18,5.4,17.1,6,16,6s-2-0.6-2.6-1.5
      C13.2,4.2,12.9,4,12.6,4h-0.2C9.9,4,7.6,4.9,5.9,6.6l-3.7,3.7c-0.4,0.4-0.4,0.9-0.1,1.3l4,5C6.4,16.8,6.7,17,6.9,17
      c0.3,0,0.6-0.1,0.8-0.3L9,15.4V27c0,0.6,0.4,1,1,1h12c0.6,0,1-0.4,1-1V15.4l1.3,1.3c0.2,0.2,0.5,0.3,0.8,0.3c0.3,0,0.5-0.2,0.7-0.4
      l4-5C30.1,11.2,30.1,10.7,29.7,10.3z"/>
  </svg>
);

const HoodieIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 304.43 304.43"
      fill="currentColor"
    >
      <path d="M176.2,218.497h-47.971c-0.603,9.548-3.716,20.083-8.962,29.98c-2.266,4.273-4.859,8.296-7.69,11.963h81.275
        c-2.831-3.667-5.425-7.69-7.691-11.963C179.916,238.581,176.804,228.046,176.2,218.497z"/>
      <path d="M302.819,183.478l-84.082-85.638c-4.173-4.25-9.878-6.644-15.834-6.644h-14.341c7.845-15.915,12.623-33.403,12.623-43.027
        c0-20.619-21.925-42.333-48.971-42.333s-48.971,21.715-48.971,42.333c0,9.492,4.65,26.634,12.304,42.372v0.655h-14.022
        c-5.956,0-11.662,2.394-15.834,6.644L1.61,183.478c-2.045,2.083-2.155,5.385-0.254,7.6l17.576,20.47
        c1.96,2.282,5.369,2.617,7.735,0.76l53.12-41.687L63.928,286.117c-0.432,3.144,0.518,6.321,2.603,8.712
        c2.086,2.392,5.104,3.764,8.277,3.764h154.813c3.173,0,6.191-1.373,8.277-3.764c2.086-2.392,3.035-5.569,2.603-8.712
        l-15.859-115.496l53.12,41.687c2.366,1.857,5.775,1.522,7.735-0.76l17.576-20.47C304.975,188.862,304.865,185.561,302.819,183.478z
        M152.215,41.502c13.636,0,24.69,10.948,24.69,21.343s-11.054,38.99-24.69,38.99c-13.636,0-24.69-28.594-24.69-38.99
        S138.579,41.502,152.215,41.502z M218.222,270.218c-0.991,3.11-3.881,5.223-7.146,5.223H93.353c-3.265,0-6.154-2.112-7.146-5.223
        c-0.992-3.11,0.143-6.505,2.806-8.395c6.41-4.547,12.447-11.782,17-20.371c5.378-10.144,8.052-21.232,7.154-29.661
        c-0.225-2.115,0.459-4.227,1.881-5.809c1.423-1.582,3.45-2.485,5.577-2.485h63.178c2.127,0,4.154,0.903,5.577,2.485
        c1.422,1.582,2.105,3.693,1.881,5.809c-0.898,8.431,1.776,19.518,7.153,29.661c0,0,0,0,0.001,0c4.553,8.589,10.59,15.824,17,20.371
        C218.079,263.713,219.214,267.108,218.222,270.218z"/>
    </svg>
);


const navItems = [
  { name: "Oversize T-Shirts", href: "/products?category=Oversize+T-Shirts", icon: OversizeTShirtIcon },
  { name: "Kids T-Shirts", href: "/products?category=Kids+T-Shirts", icon: KidsTShirtIcon },
  { name: "Regular T-Shirts", href: "/products?category=Regular+T-Shirts", icon: RegularTShirtIcon },
  {
    name: "Hoodies",
    href: "/products?category=Hoodie",
    icon: HoodieIcon
  },
];

export function Header({ user }: { user?: { name: string | null } | null }) {
  const { itemCount: cartItemCount } = useCart();
  const { itemCount: wishlistItemCount } = useWishlist();
  const [accountOpen, setAccountOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const showAuthToast = () => {
    toast({
      title: "Authentication Required",
      description: "Please log in or create an account to continue.",
      variant: "destructive",
      action: (
        <ToastAction altText="Login" onClick={() => router.push("/login")}>
          Login
        </ToastAction>
      ),
    });
  };

  const handleProtectedLink = (e: React.MouseEvent, href: string) => {
    if (!user) {
      e.preventDefault();
      showAuthToast();
    } else {
      router.push(href);
    }
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-18 items-center">
        <Link href="/" className="flex items-center gap-2 mr-6 md:mr-12 text-xl md:text-2xl pt-3 md:-ml-10 mx-auto md:mx-0">
          <Logo className="w-auto h-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center text-foreground/60 transition-colors hover:text-foreground/80"
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-2">

          <Button variant="ghost" size="icon" asChild className="hidden md:flex relative" onClick={(e) => handleProtectedLink(e, "/wishlist")}>
            <Link href="/wishlist">
              <Heart className="h-5 w-5" />
              {user && wishlistItemCount > 0 && (
                <span className="absolute top-1 right-1 flex h-3 w-3 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                  {wishlistItemCount}
                </span>
              )}
              <span className="sr-only">Wishlist</span>
            </Link>
          </Button>

          <Button variant="ghost" size="icon" asChild className="hidden md:flex relative" onClick={(e) => handleProtectedLink(e, "/cart")}>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {user && cartItemCount > 0 && (
                <span className="absolute top-1 right-1 flex h-3 w-3 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                  {cartItemCount}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Link>
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hidden md:flex font-tanBuster text-xl px-2 hover:bg-transparent text-primary hover:text-primary/80">
                  {user.name?.charAt(0).toUpperCase() || "A"}
                  <span className="sr-only">Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/account">My Account</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/wishlist">Wishlist</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders">Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/signout">Sign out</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" asChild size="sm">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">Sign up</Link>
              </Button>
            </div>
          )}

          {/* Mobile sidebar menu (opens from right, positioned after cart) */}
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
                  <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                  <div className="flex items-center gap-2 text-2xl">
                    <Logo className="w-auto h-auto" />
                  </div>
                </SheetHeader>
                <div className="mt-6 flex flex-col gap-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center gap-2 p-2 rounded-md text-foreground/80 hover:text-foreground hover:bg-accent"
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{item.name}</span>
                    </Link>
                  ))}

                  {/* My Account with dropdown */}
                  <Collapsible open={accountOpen} onOpenChange={setAccountOpen}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-md hover:bg-accent">
                      <div className="flex items-center gap-2">
                        <UserRound className="h-5 w-5" />
                        <span className="text-sm font-medium">My Account</span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${accountOpen ? "rotate-180" : ""
                          }`}
                      />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="ml-7 mt-2 flex flex-col gap-2">
                      <Link
                        href="/account"
                        onClick={(e) => handleProtectedLink(e, "/account")}
                        className="text-sm text-foreground/80 hover:text-foreground p-2 rounded-md hover:bg-accent"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/wishlist"
                        onClick={(e) => handleProtectedLink(e, "/wishlist")}
                        className="text-sm text-foreground/80 hover:text-foreground p-2 rounded-md hover:bg-accent flex justify-between"
                      >
                        <span>My Wishlist</span>
                         {user && wishlistItemCount > 0 && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                                {wishlistItemCount}
                            </span>
                         )}
                      </Link>
                      <Link
                        href="/cart"
                        onClick={(e) => handleProtectedLink(e, "/cart")}
                        className="text-sm text-foreground/80 hover:text-foreground p-2 rounded-md hover:bg-accent flex items-center justify-between"
                      >
                        <span>Cart</span>
                        {user && cartItemCount > 0 && (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                            {cartItemCount}
                          </span>
                        )}
                      </Link>
                      <Link
                        href="/orders"
                        onClick={(e) => handleProtectedLink(e, "/orders")}
                        className="text-sm text-foreground/80 hover:text-foreground p-2 rounded-md hover:bg-accent"
                      >
                        Orders
                      </Link>
                      {user ? (
                        <Link
                          href="/signout"
                          className="text-sm text-foreground/80 hover:text-foreground p-2 rounded-md hover:bg-accent"
                        >
                          Sign out
                        </Link>
                      ) : (
                        <>
                        <Link
                          href="/login"
                          className="text-sm text-foreground/80 hover:text-foreground p-2 rounded-md hover:bg-accent"
                        >
                          Login
                        </Link>
                         <Link
                          href="/register"
                          className="text-sm text-foreground/80 hover:text-foreground p-2 rounded-md hover:bg-accent"
                        >
                          Sign Up
                        </Link>
                        </>
                      )}

                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
