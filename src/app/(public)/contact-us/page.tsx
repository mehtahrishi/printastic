"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Send, Clock, MessageCircle } from "lucide-react";
import { useState } from "react";
import Script from "next/script";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  subject: z.string().min(5, "Subject must be at least 5 characters."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

export default function ContactUsPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message");
      toast({
        title: "Message sent!",
        description: "Thanks for reaching out. We'll reply soon.",
      });
      form.reset();
    } catch (err: any) {
      toast({
        title: "Failed to send",
        description: err.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <div className="container py-16 md:py-24">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-primary tracking-tight">
            Get in Touch
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-foreground/80">
            Have a question or comment? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </section>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 md:gap-12 mb-16">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <MessageCircle className="h-6 w-6 text-primary" />
                  Send us a Message
                </CardTitle>
                <CardDescription className="text-base">
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground font-semibold">Full Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="John Doe" 
                                {...field} 
                                className="h-11"
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground font-semibold">Email Address</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="you@example.com" 
                                type="email"
                                {...field} 
                                className="h-11"
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground font-semibold">Subject</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., Order Inquiry" 
                              {...field} 
                              className="h-11"
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground font-semibold">Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us how we can help you..." 
                              rows={6} 
                              {...field} 
                              className="resize-none"
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full sm:w-auto px-8"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-pulse">Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <blockquote 
                        className="instagram-media" 
                        data-instgrm-permalink="https://www.instagram.com/reel/DGvDBYMSZCy/?utm_source=ig_embed&amp;utm_campaign=loading" 
                        data-instgrm-version="14" 
                        style={{ background:'#FFF', border:0, borderRadius:'3px', boxShadow:'0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)', margin: '1px', maxWidth:'100%', minWidth:'280px', padding:0, width:'calc(100% - 2px)' }}
                    >
                    </blockquote>
                    <Script async src="//www.instagram.com/embed.js" />
                </div>
                {/* Placeholder for the second reel */}
                <div></div>
            </div>
          </div>

          {/* Contact Information Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-lg border-border/50">
              <CardHeader>
                <CardTitle className="text-xl">Contact Information</CardTitle>
                <CardDescription>
                  Reach us through any of these channels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 text-primary p-3 rounded-lg flex-shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Our Address</h4>
                    <p className="text-sm text-muted-foreground">
                      Shop No.9, Matoshree chs ltd, plot no. 387, Gyan VIkas Road, 19/C , Sector 19, Kopar Khairane, Navi mmumbai, maharashtra 400709, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 text-primary p-3 rounded-lg flex-shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Email Us</h4>
                    <a 
                      href="mailto:info@honestyprinthouse.in" 
                      className="text-sm text-primary hover:underline"
                    >
                      info@honestyprinthouse.in
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 text-primary p-3 rounded-lg flex-shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Call Us</h4>
                    <a 
                      href="tel:+919920214202" 
                      className="text-sm text-primary hover:underline block"
                    >
                      +91 9920214202
                    </a>
                     <a 
                      href="tel:+918828569484" 
                      className="text-sm text-primary hover:underline block"
                    >
                      +91 8828569484
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 text-primary p-3 rounded-lg flex-shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Business Hours</h4>
                    <p className="text-sm text-muted-foreground">
                      Mon-Fri: 9:00 AM - 6:00 PM<br />
                      Sat-Sun: Closed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Quick Links */}
            <Card className="shadow-lg border-border/50 bg-card">
              <CardHeader>
                <CardTitle className="text-xl">Quick Help</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a 
                  href="/shipping-policy" 
                  className="block text-sm text-primary hover:underline"
                >
                  → Shipping Information
                </a>
                <a 
                  href="/refund-policy" 
                  className="block text-sm text-primary hover:underline"
                >
                  → Returns & Refunds
                </a>
                <a 
                  href="/terms-and-conditions" 
                  className="block text-sm text-primary hover:underline"
                >
                  → Terms & Conditions
                </a>
                <a 
                  href="/privacy-policy" 
                  className="block text-sm text-primary hover:underline"
                >
                  → Privacy Policy
                </a>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg border-border/50 overflow-hidden">
                <CardHeader className="pb-4">
                    <CardTitle className="text-xl flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        Find Us Here
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden border">
                        <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.0932570183004!2d72.99680527466573!3d19.10356435110773!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c156b7c2b7d7%3A0x29c68b4cd30ab0c7!2sHonesty%20Print%20House!5e0!3m2!1sen!2sin!4v1765914189428!5m2!1sen!2sin"
                        width="100%"
                        height="250"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </CardContent>
            </Card>
          </div>
        </div>

        {/* Response Time Notice */}
        <section className="text-center bg-card p-8 rounded-lg shadow-sm border border-border/50">
          <h3 className="text-xl font-bold text-foreground mb-3">We're Here to Help</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We typically respond to all inquiries within 24-48 hours during business days. 
            For urgent matters, please call us directly.
          </p>
        </section>
      </div>
    </div>
  );
}
