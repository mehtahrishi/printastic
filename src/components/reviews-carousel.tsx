"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Review {
  name: string;
  rating: number;
  review: string;
  date: string;
}

interface ReviewsCarouselProps {
  initialReviews?: Review[];
}

export function ReviewsCarousel({ initialReviews = [] }: ReviewsCarouselProps) {
  const [offset, setOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Use real reviews if available, otherwise show empty state or fallback
  const displayReviews = initialReviews.length > 0 ? initialReviews : [];

  // Duplicate for infinite loop only if we have enough reviews to scroll
  const infiniteReviews = displayReviews.length > 2
    ? [...displayReviews, ...displayReviews]
    : displayReviews;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (displayReviews.length <= 2) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setOffset((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, [displayReviews.length]);

  useEffect(() => {
    if (offset === displayReviews.length) {
      setTimeout(() => {
        setIsTransitioning(false);
        setOffset(0);
      }, 500);
    }
  }, [offset, displayReviews.length]);

  const slidePercentage = isMobile ? 100 : 100 / 3;

  if (displayReviews.length === 0) {
    return null; // Don't show section if no reviews
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-primary tracking-tight">
            Reviews of Honesty Print House
          </h2>
          <p className="mt-4 text-lg text-foreground/80">
            See what our customers have to say about us
          </p>
        </div>

        <div className="relative mx-auto overflow-hidden pb-8">
          <div
            className={cn(
              "flex",
              isTransitioning && displayReviews.length > 2 && "transition-transform duration-500 ease-in-out",
              displayReviews.length <= 2 && "justify-center"
            )}
            style={{
              transform: displayReviews.length > 2 ? `translateX(-${offset * slidePercentage}%)` : 'none'
            }}
          >
            {infiniteReviews.map((review, index) => (
              <div
                key={`${review.name}-${index}`}
                className={cn(
                  "flex-shrink-0 px-3",
                  displayReviews.length > 2 ? "w-full md:w-1/3" : "w-full md:w-1/2 max-w-md"
                )}
              >
                <div className="bg-card rounded-lg shadow-lg p-6 border border-border h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="text-primary text-2xl flex-shrink-0"
                      style={{ fontFamily: "var(--font-tan-buster)" }}
                    >
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-base text-foreground">{review.name}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-3.5 w-3.5",
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-300 text-gray-300"
                            )}
                          />
                        ))}
                        <span className="text-xs text-muted-foreground ml-2">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    "{review.review}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
