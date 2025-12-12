"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, ShoppingCart as ShoppingCartIcon } from "lucide-react";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  return (
    <div className="container py-12 md:py-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <Card className="text-center py-20">
            <CardContent>
                <ShoppingCartIcon className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
                <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
                <Button asChild>
                    <Link href="/">Start Shopping</Link>
                </Button>
            </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          <div className="md:col-span-2">
            <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                    <CardTitle>Your Items</CardTitle>
                    <Button variant="outline" size="sm" onClick={clearCart}>Clear Cart</Button>
                </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                {cartItems.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center gap-4 p-4">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={100}
                      height={125}
                      className="rounded-md object-cover aspect-[4/5]"
                      data-ai-hint={product.imageHint}
                    />
                    <div className="flex-1">
                      <Link href={`/products/${product.id}`} className="font-semibold hover:text-primary">{product.name}</Link>
                      <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => updateQuantity(product.id, parseInt(e.target.value))}
                        className="w-16 h-9 text-center"
                      />
                    </div>
                    <p className="font-semibold w-20 text-right">${(product.price * quantity).toFixed(2)}</p>
                    <Button variant="ghost" size="icon" onClick={() => removeFromCart(product.id)}>
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                      <span className="sr-only">Remove item</span>
                    </Button>
                  </div>
                ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button size="lg" className="w-full" asChild>
                    <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
