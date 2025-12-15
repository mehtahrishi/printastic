import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { CookieConsent } from "@/components/cookie-consent";
import { SplashScreen } from "@/components/ui/splash-screen";

const tanBuster = localFont({
  src: "../fonts/TanBuster.otf",
  variable: "--font-tan-buster",
});

const moonTime = localFont({
  src: "../fonts/MoonTime.ttf",
  variable: "--font-moon-time",
});

export const metadata: Metadata = {
  title: "Honesty Print House",
  description: "High-quality professional printing services for all your needs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-body antialiased bg-grid",
          tanBuster.variable,
          moonTime.variable
        )}
      >
        {children}
        <Toaster />
        <CookieConsent />
        <SplashScreen />
      </body>
    </html>
  );
}
