
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Script from "next/script";
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
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { getCartItems } from "@/actions/cart";
import { getUserDetails } from "@/actions/user";
import { createOrder, verifyPayment } from "@/actions/razorpay";
import { CreditCard, Truck } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

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
  paymentMethod: z.enum(["online", "cod"]),
});

type FormValues = z.infer<typeof formSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { clearCart: clearCartLocal } = useCart();

  const form = useForm<FormValues>({
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
      paymentMethod: "online",
    },
  });

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + parseFloat(item.product.price as any) * item.quantity,
    0
  );

  const SHIPPING_COST = 50;
  const FREE_SHIPPING_THRESHOLD = 500;
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shippingCost;
  const paymentMethod = form.watch("paymentMethod");
  
  const amountToPay = paymentMethod === "cod" ? 50 : total;

  useEffect(() => {
    async function loadCheckoutData() {
      const items = await getCartItems();
      if (items.length === 0) {
        router.push("/cart");
        return;
      }
      setCartItems(items);

      const userDetails = await getUserDetails();
      if (userDetails) {
        const nameParts = userDetails.name?.split(" ") || ["", ""];
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        form.reset({
          ...form.getValues(),
          email: userDetails.email || "",
          firstName: firstName,
          lastName: lastName,
          address: userDetails.address || "",
          apartment: userDetails.apartment || "",
          city: userDetails.city || "",
          country: "India",
          zipCode: userDetails.postalCode || "",
          phone: userDetails.phone || "",
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

  async function onSubmit(values: FormValues) {
    setIsProcessing(true);

    const orderDataForDb = {
        total,
        shippingAddress: `${values.address}, ${values.apartment || ''}, ${values.city}, ${values.zipCode}`,
        paymentMethod: values.paymentMethod,
        items: cartItems.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: parseFloat(item.product.price),
            size: item.size,
            color: item.color,
        }))
    };

    try {
        const orderResponse = await createOrder(amountToPay);

        if (!orderResponse.success || !orderResponse.order) {
            throw new Error(orderResponse.error || "Failed to create Razorpay order.");
        }

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: orderResponse.order.amount,
            currency: orderResponse.order.currency,
            name: "Honesty Print House",
            description: "Test Transaction",
            order_id: orderResponse.order.id,
            handler: async function (response: any) {
                // Immediately freeze the UI
                setIsPaymentSuccessful(true);
                
                const verificationResult = await verifyPayment(response, orderDataForDb);
                if (verificationResult.success) {
                    clearCartLocal();
                    toast({ title: "Order Placed!", description: "Thank you for your purchase." });
                    toast({ title: "Invoice Sent", description: "An invoice has been sent to your email." });
                    router.push(`/orders`);
                } else {
                    toast({ title: "Payment Failed", description: verificationResult.error, variant: "destructive" });
                    // Unfreeze UI if verification fails, allowing user to retry
                    setIsPaymentSuccessful(false); 
                }
            },
            prefill: {
                name: `${values.firstName} ${values.lastName}`,
                email: values.email,
                contact: values.phone,
            },
            theme: {
                color: "#30586b",
            },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
            toast({
                title: "Payment Failed",
                description: response.error.description || "Something went wrong.",
                variant: "destructive"
            });
            setIsProcessing(false); // Re-enable button on failure
        });

        rzp.open();
    } catch (error: any) {
        console.error("Checkout error:", error);
        toast({ title: "Error", description: error.message || "An error occurred during checkout.", variant: "destructive" });
    } finally {
        // We don't set isProcessing to false here, because the Razorpay modal is now open.
        // It will be handled in the handler or on dismiss.
        // We set isProcessing to false on modal dismiss if it's not successful
        // For now this is handled in payment.failed.
    }
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
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
                      <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="you@example.com" {...field} disabled={isPaymentSuccessful} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="firstName" render={({ field }) => (
                        <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} disabled={isPaymentSuccessful} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="lastName" render={({ field }) => (
                        <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} disabled={isPaymentSuccessful} /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem><FormLabel>Phone</FormLabel><FormControl><Input placeholder="+91 98765 43210" {...field} disabled={isPaymentSuccessful} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="address" render={({ field }) => (
                      <FormItem><FormLabel>Address</FormLabel><FormControl><Input placeholder="123 Main St" {...field} disabled={isPaymentSuccessful} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="apartment" render={({ field }) => (
                      <FormItem><FormLabel>Apartment, Suite, etc. (Optional)</FormLabel><FormControl><Input placeholder="Apt 4B" {...field} disabled={isPaymentSuccessful} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="grid md:grid-cols-3 gap-4">
                      <FormField control={form.control} name="city" render={({ field }) => (
                        <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} disabled={isPaymentSuccessful} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="country" render={({ field }) => (
                        <FormItem><FormLabel>Country</FormLabel><FormControl><Input {...field} disabled={isPaymentSuccessful} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="zipCode" render={({ field }) => (
                        <FormItem><FormLabel>PIN Code</FormLabel><FormControl><Input {...field} disabled={isPaymentSuccessful} /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="grid grid-cols-1 md:grid-cols-2 gap-4"
                              disabled={isPaymentSuccessful}
                            >
                              <FormItem>
                                <FormControl>
                                    <Label className={`flex flex-col items-center justify-center rounded-lg border-2 p-4 transition-all hover:bg-accent/50 ${field.value === 'online' ? 'border-primary bg-primary/5' : ''} ${isPaymentSuccessful ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                        <RadioGroupItem value="online" id="online" className="sr-only" disabled={isPaymentSuccessful} />
                                        <CreditCard className="mb-3 h-6 w-6" />
                                        Pay Online
                                        <span className="font-normal text-muted-foreground text-sm mt-1">Cards, UPI, Netbanking & more</span>
                                    </Label>
                                </FormControl>
                              </FormItem>
                              <FormItem>
                                <FormControl>
                                    <Label className={`flex flex-col items-center justify-center rounded-lg border-2 p-4 transition-all hover:bg-accent/50 ${field.value === 'cod' ? 'border-primary bg-primary/5' : ''} ${isPaymentSuccessful ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                        <RadioGroupItem value="cod" id="cod" className="sr-only" disabled={isPaymentSuccessful} />
                                        <Truck className="mb-3 h-6 w-6" />
                                        Cash on Delivery
                                        <span className="font-normal text-muted-foreground text-sm mt-1">Pay ₹50 now, rest on delivery</span>
                                    </Label>
                                </FormControl>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                <Button type="submit" size="lg" className="w-full" disabled={isProcessing || isPaymentSuccessful}>
                  {isPaymentSuccessful ? "Payment Successful" : isProcessing ? "Processing..." : `Pay ₹${amountToPay.toFixed(2)}`}
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
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium text-right">
                        ₹{(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
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
                  {paymentMethod === 'cod' && (
                    <>
                    <Separator />
                     <div className="flex justify-between font-semibold text-primary text-md">
                        <p>Advance Payable</p>
                        <p>₹50.00</p>
                    </div>
                    <div className="flex justify-between text-muted-foreground text-sm">
                        <p>Pay on Delivery</p>
                        <p>₹{(total - 50).toFixed(2)}</p>
                    </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
