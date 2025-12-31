import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { CookieConsent } from "@/components/cookie-consent";
import { SplashScreen } from "@/components/ui/splash-screen";
import { CartProvider } from "@/hooks/use-cart";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { WishlistProvider } from "@/hooks/use-wishlist";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const tanBuster = localFont({
  src: "../fonts/TanBuster.otf",
  variable: "--font-tan-buster",
});

const moonTime = localFont({
  src: "../fonts/MoonTime.ttf",
  variable: "--font-moon-time",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002'),
  title: {
    default: "Honesty Print House - High-Quality Printing Services",
    template: "%s | Honesty Print House",
  },
  description: "Discover high-quality, professional printing services for all your needs. From custom apparel to unique art prints, we bring your ideas to life.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
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


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;

  let user = null;
  const parsedUserId = userId ? parseInt(userId) : NaN;

  if (!isNaN(parsedUserId)) {
    try {
      const result = await db
        .select({ id: users.id, name: users.name })
        .from(users)
        .where(eq(users.id, parsedUserId))
        .limit(1);
      user = result[0] || null;
    } catch (e) {
      console.error("Failed to fetch user in RootLayout", e);
      // swallow error to allow page load
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-body antialiased",
          tanBuster.variable,
          moonTime.variable
        )}
      >
        <CartProvider>
          <WishlistProvider user={user}>
            {children}
            <Toaster />
            <CookieConsent />
            <SplashScreen />
            <WhatsAppButton phoneNumber="9920214202" variant="fixed" />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
