
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
import { useState } from "react";
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

const navItems = [
  { name: "Oversize T-Shirts", href: "/products?category=Oversize+T-Shirts" },
  { name: "Kids T-Shirts", href: "/products?category=Kids+T-Shirts" },
  { name: "Regular T-Shirts", href: "/products?category=Regular+T-Shirts" },
  { name: "Hoodies", href: "/products?category=Hoodie" },
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
              className="text-foreground/60 transition-colors hover:text-primary"
            >
              {item.name}
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
                  <Link href="/orders">My Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/signout">Sign out</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              {/* Desktop Auth Buttons */}
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" asChild size="sm">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/register">Sign up</Link>
                </Button>
              </div>
              {/* Mobile Auth Buttons */}
              <div className="flex md:hidden items-center gap-1">
                <Button variant="ghost" asChild size="sm">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/register">Sign up</Link>
                </Button>
              </div>
            </>
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
                      className="p-2 rounded-md text-foreground/80 hover:text-foreground hover:bg-accent"
                    >
                      <span className="text-sm font-medium">{item.name}</span>
                    </Link>
                  ))}

                  {/* My Account with dropdown */}
                  <Collapsible open={accountOpen} onOpenChange={setAccountOpen}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-md hover:bg-accent">
                      <div className="flex items-center gap-2">
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
                        My Profile
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
                        <span>My Cart</span>
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
                        My Orders
                      </Link>
                      {user ? (
                        <Link
                          href="/signout"
                          className="text-sm text-foreground/80 hover:text-foreground p-2 rounded-md hover:bg-accent"
                        >
                          Sign out
                        </Link>
                      ) : null }

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
