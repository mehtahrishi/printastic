"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  images: string | string[];
}

function parseImages(images: any): string[] {
  if (!images) return [];
  if (Array.isArray(images)) return images;
  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return images.split(',').map(s => s.trim()).filter(Boolean);
    }
  }
  return [];
}

interface CategoryProductCarouselProps {
  category: string | null;
}

export function CategoryProductCarousel({ category }: CategoryProductCarouselProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!category) {
      setProducts([]);
      setIsVisible(false);
      return;
    }

    setLoading(true);
    setIsVisible(false);
    
    // Add 500ms delay for animation
    const loadTimer = setTimeout(() => {
      fetch(`/api/products`)
        .then(res => res.json())
        .then(data => {
          // Filter products by category and exclude color variants (ending with color words)
          const colorWords = ['black', 'white', 'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'grey', 'gray', 'brown', 'navy', 'maroon', 'olive', 'cyan', 'magenta', 'lime', 'teal', 'violet', 'indigo', 'beige', 'cream', 'tan', 'ivory', 'gold', 'silver', 'bronze', 'copper', 'khaki', 'mint', 'peach', 'coral', 'salmon', 'burgundy', 'crimson', 'scarlet', 'turquoise', 'aqua', 'lavender', 'lilac', 'rose', 'ruby', 'emerald', 'jade', 'amber', 'charcoal', 'slate'];
          
          const filtered = data.filter((p: any) => {
            // Must match category
            if (p.category !== category) return false;
            
            // Exclude if slug ends with a color word
            const slugLower = p.slug.toLowerCase();
            const endsWithColor = colorWords.some(color => slugLower.endsWith(`-${color}`));
            
            return !endsWithColor;
          });
          
          setProducts(filtered);
          setTimeout(() => setIsVisible(true), 50); // Fade in after products loaded
        })
        .catch(err => console.error('Failed to fetch products:', err))
        .finally(() => setLoading(false));
    }, 500);

    return () => clearTimeout(loadTimer);
  }, [category]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!category || products.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border-b border-border py-6 relative overflow-hidden transition-all duration-500 ease-in-out">
      <div className="container">
        <div className="relative">
          {/* Desktop Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-background shadow-lg"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Scrollable Products Container */}
          <div
            ref={scrollRef}
            className={`flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {loading ? (
              <div className="flex gap-4 animate-pulse">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-[200px]">
                    <div className="bg-muted rounded-lg overflow-hidden">
                      <div className="aspect-square bg-muted-foreground/20" />
                      <div className="p-3 space-y-2">
                        <div className="h-4 bg-muted-foreground/20 rounded w-3/4" />
                        <div className="h-4 bg-muted-foreground/20 rounded w-1/2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              products.map((product) => {
                const images = parseImages(product.images);
                const firstImage = images[0] || '/placeholder.png';

                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="flex-shrink-0 w-[200px]"
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
                      <div className="aspect-square relative bg-gray-100">
                        <Image
                          src={firstImage}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium line-clamp-2 min-h-[2.5rem]">
                          {product.name}
                        </p>
                        <p className="text-sm font-semibold text-primary mt-1">
                          ₹{product.price}
                        </p>
                      </div>
                    </Card>
                  </Link>
                );
              })
            )}
          </div>

          {/* Desktop Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-background shadow-lg"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
