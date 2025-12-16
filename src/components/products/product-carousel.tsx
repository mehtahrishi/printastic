"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { products } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";

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

export function ProductCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false })
  );

  // Group products into chunks of 3 for each slide
  const slides = [];
  for (let i = 0; i < products.length; i += 3) {
    slides.push(products.slice(i, i + 3));
  }

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[plugin.current]}
      className="w-full"
    >
      <CarouselContent>
        {slides.map((slideProducts, index) => (
          <CarouselItem key={index} className="flex gap-4">
            {slideProducts.map((product) => {
              const imageUrl = getFirstImage(product.images);
              return (
                <div key={product.id} className="p-1 basis-1/3">
                  <Card>
                    <CardContent className="flex aspect-[3/4] items-center justify-center p-0 overflow-hidden rounded-lg bg-muted/20">
                      <Link href={`/products/${product.id}`} className="block h-full w-full relative">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-300 hover:scale-105"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full w-full text-muted-foreground text-sm">
                            No Image
                          </div>
                        )}
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
