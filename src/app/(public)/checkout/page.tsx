"use client";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { clearCart, getCartItems } from "@/actions/cart";
import { getUserDetails } from "@/actions/user";

const formSchema = z.object({
  // Shipping Info
  email: z.string().email(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().min(1, "Address is required"),
  apartment: z.string().optional(),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
  phone: z.string().min(10, "Phone number is required"),
  
  // Payment Info
  paymentMode: z.enum(["card", "cod", "upi", "bank"]),
  cardName: z.string().optional(),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
});

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      address: "",
      apartment: "",
      city: "",
      country: "India",
      zipCode: "",
      phone: "",
      paymentMode: "cod",
      cardName: "",
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
    },
  });

  const subtotal = cartItems.reduce((total, item) => 
    total + (parseFloat(item.product.price as any) * item.quantity), 0
  );
  
  const SHIPPING_COST = 50;
  const FREE_SHIPPING_THRESHOLD = 500;
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shippingCost;

  useEffect(() => {
    async function loadCheckoutData() {
      // Load cart items
      const items = await getCartItems();
      if (items.length === 0) {
        router.push("/cart");
        return;
      }
      setCartItems(items);

      // Load user details and pre-fill form
      const userDetails = await getUserDetails();
      if (userDetails) {
        // Split name into first and last name
        const nameParts = userDetails.name?.split(" ") || ["", ""];
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        form.reset({
          email: userDetails.email || "",
          firstName: firstName,
          lastName: lastName,
          address: userDetails.address || "",
          apartment: userDetails.apartment || "",
          city: userDetails.city || "",
          country: "India",
          zipCode: userDetails.postalCode || "",
          phone: userDetails.phone || "",
          paymentMode: "cod",
          cardName: userDetails.name || "",
          cardNumber: "",
          cardExpiry: "",
          cardCvc: "",
        });
      }

      setIsLoading(false);
    }
    loadCheckoutData();
  }, [router, form]);

  if (isLoading) {
    return (
      <div className="container py-12 md:py-16">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading checkout...</p>
          </div>
        </div>
      </div>
    );
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsProcessing(true);
    
    // TODO: Process payment and create order in database
    console.log("Checkout submitted:", values);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
        title: "Order Placed!",
        description: "Thank you for your purchase. A confirmation email has been sent.",
    });
    
    await clearCart();
    router.push("/");
  }

  return (
    <div className="container py-12 md:py-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Checkout</h1>
      
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Shipping Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl><Input placeholder="you@example.com" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                            <div className="grid md:grid-cols-2 gap-4">
                                <FormField control={form.control} name="firstName" render={({ field }) => (
                                    <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <FormField control={form.control} name="lastName" render={({ field }) => (
                                    <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                            </div>
                            <FormField control={form.control} name="phone" render={({ field }) => (
                                <FormItem><FormLabel>Phone</FormLabel><FormControl><Input placeholder="+91 98765 43210" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="address" render={({ field }) => (
                                <FormItem><FormLabel>Address</FormLabel><FormControl><Input placeholder="123 Main St" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="apartment" render={({ field }) => (
                                <FormItem><FormLabel>Apartment, Suite, etc. (Optional)</FormLabel><FormControl><Input placeholder="Apt 4B" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <div className="grid md:grid-cols-3 gap-4">
                                <FormField control={form.control} name="city" render={({ field }) => (
                                    <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <FormField control={form.control} name="country" render={({ field }) => (
                                    <FormItem><FormLabel>Country</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <FormField control={form.control} name="zipCode" render={({ field }) => (
                                    <FormItem><FormLabel>PIN Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Method</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="paymentMode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Select Payment Method</FormLabel>
                                        <FormControl>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() => field.onChange("cod")}
                                                    className={`p-4 border-2 rounded-lg flex flex-col items-center justify-center gap-2 transition-all ${
                                                        field.value === "cod" ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"
                                                    }`}
                                                >
                                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                    <span className="text-sm font-medium">Cash on Delivery</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => field.onChange("upi")}
                                                    className={`p-4 border-2 rounded-lg flex flex-col items-center justify-center gap-2 transition-all ${
                                                        field.value === "upi" ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"
                                                    }`}
                                                >
                                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                    </svg>
                                                    <span className="text-sm font-medium">UPI</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => field.onChange("bank")}
                                                    className={`p-4 border-2 rounded-lg flex flex-col items-center justify-center gap-2 transition-all ${
                                                        field.value === "bank" ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"
                                                    }`}
                                                >
                                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                                                    </svg>
                                                    <span className="text-sm font-medium">Bank Transfer</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => field.onChange("card")}
                                                    className={`p-4 border-2 rounded-lg flex flex-col items-center justify-center gap-2 transition-all ${
                                                        field.value === "card" ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"
                                                    }`}
                                                >
                                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                    </svg>
                                                    <span className="text-sm font-medium">Card</span>
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {form.watch("paymentMode") === "card" && (
                                <div className="space-y-4 pt-4">
                                    <FormField control={form.control} name="cardName" render={({ field }) => (
                                        <FormItem><FormLabel>Name on Card</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                    <FormField control={form.control} name="cardNumber" render={({ field }) => (
                                        <FormItem><FormLabel>Card Number</FormLabel><FormControl><Input placeholder="•••• •••• •••• ••••" {...field} /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField control={form.control} name="cardExpiry" render={({ field }) => (
                                            <FormItem><FormLabel>Expiry (MM/YY)</FormLabel><FormControl><Input placeholder="MM/YY" {...field} /></FormControl><FormMessage /></FormItem>
                                        )}/>
                                        <FormField control={form.control} name="cardCvc" render={({ field }) => (
                                            <FormItem><FormLabel>CVC</FormLabel><FormControl><Input placeholder="123" {...field} /></FormControl><FormMessage /></FormItem>
                                        )}/>
                                    </div>
                                </div>
                            )}

                            {form.watch("paymentMode") === "cod" && (
                                <p className="text-sm text-muted-foreground">Pay with cash when your order is delivered.</p>
                            )}

                            {form.watch("paymentMode") === "upi" && (
                                <p className="text-sm text-muted-foreground">UPI payment details will be provided after order confirmation.</p>
                            )}

                            {form.watch("paymentMode") === "bank" && (
                                <p className="text-sm text-muted-foreground">Bank transfer details will be sent to your email after order confirmation.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>QR Code Payment (Optional)</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center py-6">
                            <div className="border-2 border-dashed rounded-lg p-8 text-center">
                                <svg className="w-24 h-24 mx-auto mb-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                </svg>
                                <p className="text-sm text-muted-foreground">Scan QR code to pay instantly</p>
                                <p className="text-xs text-muted-foreground mt-2">QR code will be displayed after order placement</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full" 
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Processing..." : `Pay ₹${total.toFixed(2)}`}
                    </Button>
                </form>
            </Form>
        </div>
        <div className="lg:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle>Your Order</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {cartItems.map(item => {
                            const details = [item.size, `Qty: ${item.quantity}`, item.color].filter(Boolean).join(' x ');
                            return (
                                <div key={item.id} className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold">{item.product.name}</p>
                                        <p className="text-sm text-muted-foreground">{details}</p>
                                    </div>
                                    <p className="font-medium text-right">₹{(parseFloat(item.product.price) * item.quantity).toFixed(2)}</p>
                                </div>
                            );
                        })}
                        <Separator />
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Shipping</span>
                            {shippingCost === 0 ? (
                              <span className="text-green-600 font-medium">Free</span>
                            ) : (
                              <span>₹{shippingCost.toFixed(2)}</span>
                            )}
                          </div>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                            <p>Total</p>
                            <p>₹{total.toFixed(2)}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
