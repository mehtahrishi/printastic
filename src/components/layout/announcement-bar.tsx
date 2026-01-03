
"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const announcements = [
  "🎉 Free shipping on orders over ₹450!",
  "✨ New arrivals just dropped - Shop now!",
  "💝 Get 10% off your first order with code: FIRST10",
  "🚚 Same day delivery available in select areas",
];

export function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % announcements.length);
        setIsAnimating(false);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white border-b border-border py-2.5 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center overflow-hidden">
          <p
            className={cn(
              "text-sm md:text-base font-medium text-foreground transition-all duration-500",
              isAnimating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
            )}
          >
            {announcements[currentIndex]}
          </p>
        </div>
      </div>
    </div>
  );
}
