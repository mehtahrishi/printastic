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
            <div className="mt-8">
            <blockquote 
              className="instagram-media" 
              data-instgrm-captioned 
              data-instgrm-permalink="https://www.instagram.com/reel/DGvDBYMSZCy/?utm_source=ig_embed&amp;utm_campaign=loading" 
              data-instgrm-version="14" 
              style={{ background:'#FFF', border:0, borderRadius:'3px', boxShadow:'0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)', margin: '1px', maxWidth:'540px', minWidth:'326px', padding:0, width:'99.375%', WebkitCalc:'calc(100% - 2px)', calc:'calc(100% - 2px)' }}
            >
              <div style={{padding:'16px'}}>
                <a href="https://www.instagram.com/reel/DGvDBYMSZCy/?utm_source=ig_embed&amp;utm_campaign=loading" style={{ background:'#FFFFFF', lineHeight:0, padding:'0 0', textAlign:'center', textDecoration:'none', width:'100%'}} target="_blank" rel="noopener noreferrer">
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <div style={{backgroundColor: '#F4F4F4', borderRadius: '50%', flexGrow: 0, height: '40px', marginRight: '14px', width: '40px'}}></div>
                    <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'center'}}>
                      <div style={{ backgroundColor: '#F4F4F4', borderRadius: '4px', flexGrow: 0, height: '14px', marginBottom: '6px', width: '100px'}}></div>
                      <div style={{ backgroundColor: '#F4F4F4', borderRadius: '4px', flexGrow: 0, height: '14px', width: '60px'}}></div>
                    </div>
                  </div>
                  <div style={{padding: '19% 0'}}></div>
                  <div style={{display:'block', height:'50px', margin:'0 auto 12px', width:'50px'}}>
                    <svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg" xmlnsXlink="https://www.w3.org/1999/xlink">
                      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                        <g transform="translate(-511.000000, -20.000000)" fill="#000000">
                          <g>
                            <path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path>
                          </g>
                        </g>
                      </g>
                    </svg>
                  </div>
                  <div style={{paddingTop: '8px'}}>
                    <div style={{color:'#3897f0', fontFamily:'Arial,sans-serif', fontSize:'14px', fontStyle:'normal', fontWeight:550, lineHeight:'18px'}}>View this post on Instagram</div>
                  </div>
                  <div style={{padding: '12.5% 0'}}></div>
                  <div style={{display: 'flex', flexDirection: 'row', marginBottom: '14px', alignItems: 'center'}}>
                    <div>
                      <div style={{backgroundColor: '#F4F4F4', borderRadius: '50%', height: '12.5px', width: '12.5px', transform: 'translateX(0px) translateY(7px)'}}></div>
                      <div style={{backgroundColor: '#F4F4F4', height: '12.5px', transform: 'rotate(-45deg) translateX(3px) translateY(1px)', width: '12.5px', flexGrow: 0, marginRight: '14px', marginLeft: '2px'}}></div>
                      <div style={{backgroundColor: '#F4F4F4', borderRadius: '50%', height: '12.5px', width: '12.5px', transform: 'translateX(9px) translateY(-18px)'}}></div>
                    </div>
                    <div style={{marginLeft: '8px'}}>
                      <div style={{backgroundColor: '#F4F4F4', borderRadius: '50%', flexGrow: 0, height: '20px', width: '20px'}}></div>
                      <div style={{width: 0, height: 0, borderTop: '2px solid transparent', borderLeft: '6px solid #f4f4f4', borderBottom: '2px solid transparent', transform: 'translateX(16px) translateY(-4px) rotate(30deg)'}}></div>
                    </div>
                    <div style={{marginLeft: 'auto'}}>
                      <div style={{width: '0px', borderTop: '8px solid #F4F4F4', borderRight: '8px solid transparent', transform: 'translateY(16px)'}}></div>
                      <div style={{backgroundColor: '#F4F4F4', flexGrow: 0, height: '12px', width: '16px', transform: 'translateY(-4px)'}}></div>
                      <div style={{width: 0, height: 0, borderTop: '8px solid #F4F4F4', borderLeft: '8px solid transparent', transform: 'translateY(-4px) translateX(8px)'}}></div>
                    </div>
                  </div>
                  <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'center', marginBottom: '24px'}}>
                    <div style={{backgroundColor: '#F4F4F4', borderRadius: '4px', flexGrow: 0, height: '14px', marginBottom: '6px', width: '224px'}}></div>
                    <div style={{backgroundColor: '#F4F4F4', borderRadius: '4px', flexGrow: 0, height: '14px', width: '144px'}}></div>
                  </div>
                </a>
                <p style={{color:'#c9c8cd', fontFamily:'Arial,sans-serif', fontSize:'14px', lineHeight:'17px', marginBottom:0, marginTop:'8px', overflow:'hidden', padding:'8px 0 7px', textAlign:'center', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
                  <a href="https://www.instagram.com/reel/DGvDBYMSZCy/?utm_source=ig_embed&amp;utm_campaign=loading" style={{color:'#c9c8cd', fontFamily:'Arial,sans-serif', fontSize:'14px', fontStyle:'normal', fontWeight:'normal', lineHeight:'17px', textDecoration:'none'}} target="_blank" rel="noopener noreferrer">A post shared by Tanaji Dhonde (@honesty_printhouse)</a>
                </p>
              </div>
            </blockquote>
            <Script async src="//www.instagram.com/embed.js" />
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

            {/* Map Section */}
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
