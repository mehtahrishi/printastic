
"use client";

import { Brush, Facebook, Instagram, Twitter } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SVGProps } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const VisaIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="38" height="24" viewBox="0 0 38 24" role="img" aria-labelledby="pi-visa" {...props}>
        <title id="pi-visa">Visa</title>
        <g fill="none">
            <path fill="#282828" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" opacity=".07"/>
            <path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"/>
            <path fill="#142688" d="m28.3 10.1-1.1 5.2h1.6l1-4.7c.1-.4.2-.7.3-1.1h.1c-.1.4-.2.7-.3 1.1l-1 4.7h1.6l1.1-5.2H28.3zm-6.8.5c.3 0 .6.1.8.3s.3.4.3.7l-.1 2.6c0 .3-.1.5-.3.6s-.4.2-.8.2h-.3c-.3 0-.5 0-.7-.1l-.1.1-1.1 2.6h-1.6l2.3-5.2h1zm-5.2 2.4c0-.6.2-1.1.6-1.4s.8-.5 1.4-.5c.8 0 1.4.2 2 .5l.2-1c-.5-.2-1.2-.4-2.1-.4-1.2 0-2.1.4-2.7 1.1s-.9 1.7-.9 2.9c0 .8.2 1.5.5 2 .4.5.9.7 1.6.7.7 0 1.3-.2 1.7-.5l-.2-.9c-.4.2-1 .4-1.5.4-.5 0-.9-.2-1.2-.5s-.4-.8-.4-1.4zm-7.1-.4-1.9-4.8h-1.6l-2.3 5.2h1.7l.4-1h2.2l.2 1h1.5zm-2.2-2.7.7 2h-1.6l.9-2zM4 10.2h1.2l-1.9 4.8h-1.4L4 10.2z"/>
        </g>
    </svg>
);

const MastercardIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="38" height="24" viewBox="0 0 38 24" role="img" aria-labelledby="pi-mastercard" {...props}>
        <title id="pi-mastercard">Mastercard</title>
        <g fill="none">
            <path fill="#282828" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" opacity=".07"/>
            <path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"/>
            <circle fill="#EB001B" cx="15" cy="12" r="7"/>
            <circle fill="#F79E1B" cx="23" cy="12" r="7"/>
            <path fill="#FF5F00" d="M22 12c0-3.9-3.1-7-7-7s-7 3.1-7 7 3.1 7 7 7 7-3.1 7-7z"/>
        </g>
    </svg>
);

const GPayIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="38" height="24" viewBox="0 0 38 24" role="img" aria-labelledby="pi-gpay" {...props}>
        <title id="pi-gpay">GPay</title>
        <g fill="none">
            <path fill="#282828" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" opacity=".07"/>
            <path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"/>
            <path fill="#5F6368" d="M19.1 10.9h-5.9v2.2h4.9c-.2 1.3-1.6 2.3-3.6 2.3-2.1 0-3.9-1.8-3.9-4s1.7-4 3.9-4c1.2 0 2 .5 2.5 1l1.5-1.5C22.4 5.9 21 5.2 19 5.2c-3.7 0-6.7 3-6.7 6.8s3 6.7 6.7 6.7c3.8 0 6.5-2.7 6.5-6.6 0-.5-.1-.9-.1-1.2z"/>
            <path fill="#4285F4" d="M26.6 9.8h-2.2V7.6h-1.6v2.2h-2.2v1.6h2.2v2.2h1.6v-2.2h2.2z"/>
            <path fill="#34A853" d="M19 5.2c1.9 0 3.6.7 4.9 1.9l-1.5 1.5c-.8-.8-1.9-1.2-3.4-1.2-2.2 0-4.1 1.2-5.1 3h6.6v-2z"/>
            <path fill="#FBBC04" d="M13.9 12c0-1.8 1.9-3 5.1-3 1.5 0 2.6.5 3.4 1.2l1.5-1.5C22.5 7.1 20.9 6.2 19 6.2c-3.7 0-6.7 3-6.7 6.8 0 .5.1.9.1 1.4 0 0 3.3-1.9 3.5-2.4z"/>
            <path fill="#EA4335" d="M19.1 15.4c-2 0-3.4-.9-3.6-2.3h7.2c.1-.4.1-.7.1-1.1 0-4-2.7-6.6-6.5-6.6-3.7 0-6.7 3-6.7 6.8s3 6.7 6.7 6.7c3 0 5.3-1.8 6.2-4.4l-1.6-.7c-.6 1.4-2 2.3-4.6 2.3z"/>
        </g>
    </svg>
);

const newsletterFormSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});


export function Footer() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof newsletterFormSchema>>({
    resolver: zodResolver(newsletterFormSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof newsletterFormSchema>) {
    console.log("Newsletter signup:", values);
    toast({
      title: "Subscribed!",
      description: "Thanks for signing up for our newsletter.",
    });
    form.reset();
  }

  return (
    <footer className="bg-muted text-muted-foreground">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Brush className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg text-foreground">Printastic</span>
            </Link>
            <p className="text-sm">High-quality prints for your home and office.</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm hover:text-primary">All Products</Link></li>
              <li><Link href="#" className="text-sm hover:text-primary">New Arrivals</Link></li>
              <li><Link href="#" className="text-sm hover:text-primary">Best Sellers</Link></li>
              <li><Link href="#" className="text-sm hover:text-primary">Sale</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about-us" className="text-sm hover:text-primary">About Us</Link></li>
              <li><Link href="/contact-us" className="text-sm hover:text-primary">Contact Us</Link></li>
              <li><Link href="#" className="text-sm hover:text-primary">Careers</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/terms-and-conditions" className="text-sm hover:text-primary">Terms & Conditions</Link></li>
              <li><Link href="/privacy-policy" className="text-sm hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/shipping-policy" className="text-sm hover:text-primary">Shipping Policy</Link></li>
              <li><Link href="/refund-policy" className="text-sm hover:text-primary">Refund Policy</Link></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <h4 className="font-semibold text-foreground mb-4">Subscribe to our newsletter</h4>
            <p className="text-sm mb-4">Get the latest on sales, new releases and more.</p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} className="bg-background"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Subscribe</Button>
              </form>
            </Form>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
              <p className="text-sm">&copy; {new Date().getFullYear()} Printastic</p>
          </div>
          <div className="flex items-center gap-4">
            <h5 className="text-sm font-medium text-foreground">Follow Us:</h5>
            <Link href="#" aria-label="Facebook"><Facebook className="h-5 w-5 hover:text-primary" /></Link>
            <Link href="#" aria-label="Instagram"><Instagram className="h-5 w-5 hover:text-primary" /></Link>
            <Link href="#" aria-label="Twitter"><Twitter className="h-5 w-5 hover:text-primary" /></Link>
          </div>
           <div className="flex items-center gap-2">
              <VisaIcon />
              <MastercardIcon />
              <GPayIcon />
            </div>
        </div>
      </div>
    </footer>
  );
}
