import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Package, Truck, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function TrackOrderPage() {
    return (
        <div className="container py-12 md:py-20 max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
                    <Truck className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">Track Your Order</h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    Enter your order ID below to check the status of your shipment.
                    You can find your order ID in the confirmation email we sent you.
                </p>
            </div>

            <div className="max-w-md mx-auto bg-card border rounded-2xl shadow-sm p-6 mb-12">
                <form className="space-y-4" action="/account/orders" method="GET">
                    <div className="space-y-2">
                        <label htmlFor="order-id" className="text-sm font-medium">Order ID</label>
                        <Input
                            id="order-id"
                            name="id"
                            placeholder="e.g. #12345"
                            className="h-11"
                        />
                    </div>
                    <Button className="w-full h-11" type="submit">
                        Track Order
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </form>
                <div className="mt-4 text-center">
                    <p className="text-xs text-muted-foreground">
                        Don't have an order ID? <Link href="/account/orders" className="text-primary hover:underline">View my orders</Link>
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center">
                    <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mb-4 text-muted-foreground">
                        <Package className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold mb-2">Order Processing</h3>
                    <p className="text-sm text-muted-foreground">We typically process orders within 24-48 hours of purchase.</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mb-4 text-muted-foreground">
                        <Truck className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold mb-2">Shipping</h3>
                    <p className="text-sm text-muted-foreground">Express shipping typically takes 3-5 business days.</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mb-4 text-muted-foreground">
                        <MapPin className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold mb-2">Delivery</h3>
                    <p className="text-sm text-muted-foreground">Delivered right to your doorstep with real-time tracking.</p>
                </div>
            </div>
        </div>
    );
}
