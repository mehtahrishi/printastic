
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

function getFirstImage(product: any): string {
    const { images, imageUrl } = product;
    if (imageUrl) return imageUrl;
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
    Autoplay({ delay: 2500, stopOnInteraction: true })
  );

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[plugin.current]}
      className="w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {products.map((product, index) => {
          const imageUrl = getFirstImage(product);
          return (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-[3/4] items-center justify-center p-0 overflow-hidden rounded-lg">
                    <Link href={`/products/${product.id}`} className="block h-full w-full relative group">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full bg-muted text-muted-foreground text-sm">
                          No Image
                        </div>
                      )}
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
}
