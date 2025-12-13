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

export function ProductCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[plugin.current]}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
      className="w-full"
    >
      <CarouselContent>
        {products.map((product) => (
          <CarouselItem key={product.id} className="basis-full sm:basis-1/2 md:basis-1/3">
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-[3/4] items-center justify-center p-0 overflow-hidden rounded-lg">
                    <Link href={`/products/${product.id}`} className="block h-full w-full">
                        <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            data-ai-hint={product.imageHint}
                        />
                    </Link>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
