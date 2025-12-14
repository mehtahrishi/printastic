
import { ShieldCheck, PackageX, Truck, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';

export default function RefundPolicyPage() {
    return (
      <div className="container py-12 md:py-16">
        <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 text-primary p-4 rounded-full w-fit mb-4">
                    <ShieldCheck className="h-10 w-10" />
                </div>
                <CardTitle className="text-3xl md:text-4xl">Refund Policy</CardTitle>
                <CardDescription className="text-lg pt-2">
                    Your satisfaction is important. Please read our policy carefully.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pt-8">

                <div className="flex items-start gap-4">
                    <Truck className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                        <h3 className="font-semibold text-lg">Quality Issues & Replacements</h3>
                        <p className="text-muted-foreground mt-1">
                            If there is a quality issue with the t-shirt or the print, we will offer a replacement. In case of a quality issue with the product, such as defects in the t-shirt or print, we will provide a replacement. The replacement will be processed within 5-7 business days. To be eligible, please contact us at <a href="mailto:support@printastic.com" className="text-primary underline">support@printastic.com</a> with photos of the issue and your order number.
                        </p>
                    </div>
                </div>

                <Alert variant="destructive">
                    <PackageX className="h-5 w-5" />
                    <AlertTitle className="font-bold">No Returns or Exchanges</AlertTitle>
                    <AlertDescription>
                        We do not accept returns for any reason, including sizing issues. All products are printed on demand, and returned items are considered dead stock. Please ensure you choose the correct size before placing your order. Each product is made to order, and returned items are considered dead stock.
                    </AlertDescription>
                </Alert>

                <div className="flex items-start gap-4">
                    <Truck className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                        <h3 className="font-semibold text-lg">Damaged Items</h3>
                        <p className="text-muted-foreground mt-1">
                            If your order arrives damaged from shipping, please contact us immediately with photos of the damaged item and packaging. We will arrange for a replacement to be sent to you at no additional cost.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                        <h3 className="font-semibold text-lg">Contact Us</h3>
                        <p className="text-muted-foreground mt-1">
                            If you have any questions about our refund policy, please do not hesitate to <Link href="/contact-us" className="text-primary underline">contact us</Link>.
                        </p>
                    </div>
                </div>

            </CardContent>
        </Card>
      </div>
    );
  }
