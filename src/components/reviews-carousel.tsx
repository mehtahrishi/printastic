"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const reviews = [
  {
    name: "Rajesh Kumar",
    rating: 5,
    review: "Outstanding quality and fast delivery! The print quality exceeded my expectations. Highly recommended for custom t-shirts.",
    date: "2 weeks ago"
  },
  {
    name: "Priya Sharma",
    rating: 5,
    review: "Absolutely love the prints! The colors are vibrant and the fabric quality is excellent. Will definitely order again.",
    date: "1 month ago"
  },
  {
    name: "Amit Patel",
    rating: 4,
    review: "Great service and good quality products. The team was very helpful with my custom design requirements.",
    date: "3 weeks ago"
  },
  {
    name: "Sneha Reddy",
    rating: 5,
    review: "Best printing house in the area! Professional work, timely delivery, and affordable prices. Very satisfied!",
    date: "1 week ago"
  },
  {
    name: "Vikram Singh",
    rating: 5,
    review: "Excellent work on my bulk order. The quality was consistent across all pieces. Highly professional team!",
    date: "2 months ago"
  },
  {
    name: "Anjali Desai",
    rating: 4,
    review: "Very impressed with the print quality. The colors match perfectly with what I expected. Great job!",
    date: "3 weeks ago"
  },
];

// Duplicate reviews for infinite loop
const infiniteReviews = [...reviews, ...reviews];

export function ReviewsCarousel() {
  const [offset, setOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setOffset((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (offset === reviews.length) {
      setTimeout(() => {
        setIsTransitioning(false);
        setOffset(0);
      }, 500);
    }
  }, [offset]);

  const slidePercentage = isMobile ? 100 : 100 / 3;

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
              isTransitioning && "transition-transform duration-500 ease-in-out"
            )}
            style={{ transform: `translateX(-${offset * slidePercentage}%)` }}
          >
            {infiniteReviews.map((review, index) => (
              <div
                key={index}
                className="w-full md:w-1/3 flex-shrink-0 px-3"
              >
                <div className="bg-card rounded-lg shadow-lg p-6 border border-border h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div 
                      className="text-primary text-2xl flex-shrink-0"
                      style={{ fontFamily: "var(--font-tan-buster)" }}
                    >
                      {review.name.charAt(0)}
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
