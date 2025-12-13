"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Cookie } from "lucide-react";

export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("cookie-consent");
      if (consent !== "true") {
        setShowConsent(true);
      }
    } catch (error) {
        // This can happen in server rendering or if localStorage is disabled.
        // We'll default to not showing the banner in this case.
        setShowConsent(false);
    }
  }, []);

  const acceptConsent = () => {
    try {
      localStorage.setItem("cookie-consent", "true");
      setShowConsent(false);
    } catch (error) {
        console.error("Could not save cookie consent to local storage.", error);
        setShowConsent(false);
    }
  };

  if (!showConsent) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Cookie className="h-8 w-8 text-primary flex-shrink-0" />
            <div className="flex-grow">
              <h3 className="font-semibold text-lg">We use cookies</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Our website uses cookies to enhance your experience. By
                continuing to browse, you agree to our{" "}
                <Link href="/privacy-policy" className="underline hover:text-primary">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
            <div className="flex gap-2 self-start sm:self-center">
              <Button onClick={acceptConsent}>Accept</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
