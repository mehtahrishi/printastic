import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { CookieConsent } from "@/components/cookie-consent";
import { SplashScreen } from "@/components/ui/splash-screen";
import { ChatWidget } from "@/components/chat-widget";
import { CartProvider } from "@/hooks/use-cart";
import { WishlistProvider } from "@/hooks/use-wishlist";

const tanBuster = localFont({
  src: "../fonts/TanBuster.otf",
  variable: "--font-tan-buster",
});

const moonTime = localFont({
  src: "../fonts/MoonTime.ttf",
  variable: "--font-moon-time",
});

export const metadata: Metadata = {
  title: {
    default: "Honesty Print House - High-Quality Printing Services",
    template: "%s | Honesty Print House",
  },
  description: "Discover high-quality, professional printing services for all your needs. From custom apparel to unique art prints, we bring your ideas to life.",
  openGraph: {
    title: "Honesty Print House",
    description: "High-quality professional printing services for all your needs.",
    url: "https://honestyprinthouse.in",
    siteName: "Honesty Print House",
    images: [
      {
        url: "/image.png", // Path to your logo
        width: 512,
        height: 512,
        alt: "Honesty Print House Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Honesty Print House",
    description: "High-quality professional printing services for all your needs.",
    images: ["/image.png"], // Path to your logo
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/image.png" type="image/png" sizes="any" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-body antialiased bg-grid",
          tanBuster.variable,
          moonTime.variable
        )}
      >
        <CartProvider>
          <WishlistProvider>
            {children}
            <Toaster />
            <ChatWidget />
            <CookieConsent />
            <SplashScreen />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
