
"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface PrintPreviewProps {
  product: any; // Using any to be more flexible with product data structure
}

export function PrintPreview({ product }: PrintPreviewProps) {
  // Combine main product images and preview images
  const mainImages = (product.images || []).map((url: string, index: number) => ({
    id: `main_${index}`,
    imageUrl: url,
    setting: `Image ${index + 1}`,
    imageHint: (product as any).imageHint,
  }));
  const settingPreviews = product.previews || [];
  
  const allPreviews = [...mainImages, ...settingPreviews];

  const [activePreview, setActivePreview] = useState(allPreviews[0]?.imageUrl || '');

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden">
        <div className="relative w-full max-w-md mx-auto" style={{ aspectRatio: 'auto' }}>
            {activePreview && (
                <Image
                src={activePreview}
                alt={`Preview of ${product.name}`}
                width={500}
                height={600}
                className="w-full h-auto object-contain transition-opacity duration-300"
                sizes="(max-width: 768px) 100vw, 40vw"
                data-ai-hint={allPreviews.find((p: any) => p.imageUrl === activePreview)?.imageHint}
                />
            )}
        </div>
      </div>
        
      {allPreviews.length > 1 && (
          <div className="max-w-md mx-auto w-full">
            <div className="grid grid-cols-4 gap-3">
              {allPreviews.map((preview: any) => (
                  <button
                  key={preview.id}
                  onClick={() => setActivePreview(preview.imageUrl)}
                  className={cn(
                      "relative aspect-square overflow-hidden rounded-lg border-2 transition-all",
                      activePreview === preview.imageUrl
                      ? "border-primary ring-2 ring-primary ring-offset-1"
                      : "border-border hover:border-primary/50"
                  )}
                  >
                  <Image
                      src={preview.imageUrl}
                      alt={preview.setting}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 20vw, 10vw"
                  />
                  </button>
              ))}
            </div>
          </div>
      )}
    </div>
  );
}
