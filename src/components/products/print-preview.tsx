"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PrintPreviewProps {
  product: Product;
}

export function PrintPreview({ product }: PrintPreviewProps) {
  const [activePreview, setActivePreview] = useState(product.imageUrl);
  const [activeHint, setActiveHint] = useState(product.imageHint);

  const allPreviews = [
    {
      id: "original",
      imageUrl: product.imageUrl,
      imageHint: product.imageHint,
      setting: "Original",
    },
    ...product.previews,
  ];

  return (
    <div>
      <div className="relative mb-4 overflow-hidden rounded-lg border bg-card aspect-square md:aspect-[4/3]">
        <Image
          src={activePreview}
          alt={`Preview of ${product.name}`}
          fill
          className="object-cover transition-opacity duration-300"
          data-ai-hint={activeHint}
        />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {allPreviews.map((preview) => (
          <button
            key={preview.id}
            onClick={() => {
              setActivePreview(preview.imageUrl);
              setActiveHint(preview.imageHint);
            }}
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
              sizes="(max-width: 768px) 25vw, 10vw"
              data-ai-hint={preview.imageHint}
            />
            {preview.setting !== "Original" && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                 <span className="text-white text-xs font-bold text-center">{preview.setting}</span>
              </div>
            )}
             {activePreview === preview.imageUrl && <div className="absolute inset-0 border-2 border-primary rounded-md"></div>}
          </button>
        ))}
      </div>
    </div>
  );
}
