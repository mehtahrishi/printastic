"use client";

import * as React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface Product {
  id: number | string;
  name: string;
  slug: string;
  images: string[];
}

interface ProductCarouselProps {
  trendingProducts?: Product[];
}

function getFirstImage(images: string[] | string | undefined): string {
  if (!images) return '';
  if (Array.isArray(images)) return images[0] || '';
  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed[0] || '' : '';
    } catch {
      return images.split(',')[0]?.trim() || '';
    }
  }
  return '';
}

export function ProductCarousel({ trendingProducts = [] }: ProductCarouselProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  // Group products into slides of 3
  const slides = [];
  for (let i = 0; i < trendingProducts.length; i += 3) {
    slides.push(trendingProducts.slice(i, i + 3));
  }

  if (trendingProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No trending products available</p>
      </div>
    );
  }

  return (
    <Carousel
      opts={{
        align: "center",
        loop: true,
      }}
      plugins={[plugin.current]}
      className="w-full"
    >
      <CarouselContent>
        {slides.map((slideProducts, slideIndex) => (
          <CarouselItem key={slideIndex}>
            <div className="grid grid-cols-3 gap-4">
              {slideProducts.map((product, index) => {
                const imageUrl = getFirstImage(product.images);
                return (
                  <Link 
                    key={product.id} 
                    href={`/products/${product.slug}`}
                    className="relative w-full aspect-square group"
                  >
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        priority={slideIndex === 0 && index === 0}
                        className="object-contain transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full bg-muted text-muted-foreground">
                        No Image
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
