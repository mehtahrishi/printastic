"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PrintPreviewProps {
  product: Product;
}

export function PrintPreview({ product }: PrintPreviewProps) {
  // Combine main product images and preview images
  const mainImages = product.images.map((url, index) => ({
    id: `main_${index}`,
    imageUrl: url,
    setting: `Image ${index + 1}`,
    imageHint: product.imageHint,
  }));
  const settingPreviews = product.previews || [];
  
  const allPreviews = [...mainImages, ...settingPreviews];

  const [activePreview, setActivePreview] = useState(allPreviews[0]?.imageUrl || '');

  return (
    <div className="sticky top-24">
      <div className="relative mb-4 overflow-hidden rounded-lg border bg-card aspect-square md:aspect-[4/4]">
        <Image
          src={activePreview}
          alt={`Preview of ${product.name}`}
          fill
          className="object-cover transition-opacity duration-300"
          data-ai-hint={allPreviews.find(p => p.imageUrl === activePreview)?.imageHint}
        />
      </div>
      
      {allPreviews.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {allPreviews.map((preview) => (
            <button
              key={preview.id}
              onClick={() => setActivePreview(preview.imageUrl)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-md border-2 transition-all",
                activePreview === preview.imageUrl
                  ? "border-primary ring-2 ring-primary ring-offset-2"
                  : "border-transparent hover:border-primary/50"
              )}
            >
              <Image
                src={preview.imageUrl}
                alt={preview.setting}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 20vw, 10vw"
              />
              {activePreview === preview.imageUrl && <div className="absolute inset-0 border-2 border-primary rounded-md"></div>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
