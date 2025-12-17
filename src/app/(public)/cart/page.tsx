import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart as ShoppingCartIcon } from "lucide-react";
import { getCartItems } from "@/actions/cart";
import CartItemRow from "@/components/cart/cart-item-row";

export default async function CartPage() {
  const cartItems = await getCartItems();
  const subtotal = cartItems.reduce((total, item) => total + (parseFloat(item.product.price as any) * item.quantity), 0);
  
  // Shipping: ₹50 flat rate, free for orders ≥ ₹500
  const SHIPPING_COST = 50;
  const FREE_SHIPPING_THRESHOLD = 500;
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const cartTotal = subtotal + shippingCost;

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
                <CardHeader>
                    <CardTitle>Your Items ({cartItems.length})</CardTitle>
                </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                {cartItems.map((item) => (
                  <CartItemRow key={item.id} item={item} />
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
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  {shippingCost === 0 ? (
                    <span className="text-green-600 font-medium">Free</span>
                  ) : (
                    <span>₹{shippingCost.toFixed(2)}</span>
                  )}
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
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
