
import { Truck, Package, Clock, CircleDollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function ShippingPolicyPage() {
    return (
      <div className="container py-12 md:py-16">
        <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 text-primary p-4 rounded-full w-fit mb-4">
                    <Truck className="h-10 w-10" />
                </div>
                <CardTitle className="text-3xl md:text-4xl">Shipping Policy</CardTitle>
                <CardDescription className="text-lg pt-2">
                    Here’s what you need to know about our shipping process.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pt-8">

                <div className="flex items-start gap-4">
                    <Clock className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                        <h3 className="font-semibold text-lg">Processing Time</h3>
                        <p className="text-muted-foreground mt-1">
                            Orders will be processed within 2-3 business days after receiving payment.
                        </p>
                    </div>
                </div>
                
                <div className="flex items-start gap-4">
                    <Package className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                        <h3 className="font-semibold text-lg">Delivery Estimates</h3>
                        <p className="text-muted-foreground mt-1">
                            Delivery times may vary depending on the location, but typically take 5-7 business days. We offer shipping to various locations as specified on our website. Please note that we are not responsible for any delays caused by shipping carriers.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <Truck className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                        <h3 className="font-semibold text-lg">Order Tracking</h3>
                        <p className="text-muted-foreground mt-1">
                            Once the order is dispatched, you will receive a tracking number to monitor the shipment status.
                        </p>
                    </div>
                </div>
                
                <div className="flex items-start gap-4">
                    <CircleDollarSign className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                        <h3 className="font-semibold text-lg">Shipping Fees</h3>
                        <p className="text-muted-foreground mt-1">
                            Shipping charges are calculated based on the delivery address and the weight of the order. Shipping fees are non-refundable.
                        </p>
                    </div>
                </div>

            </CardContent>
        </Card>
      </div>
    );
  }
