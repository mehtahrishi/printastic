"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface PrintPreviewProps {
  product: any;
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle client-side mounting for Portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  // Find current index for navigation
  const currentIndex = allPreviews.findIndex((p: any) => p.imageUrl === activePreview);

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const nextIdx = (currentIndex + 1) % allPreviews.length;
    setActivePreview(allPreviews[nextIdx].imageUrl);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const prevIdx = (currentIndex - 1 + allPreviews.length) % allPreviews.length;
    setActivePreview(allPreviews[prevIdx].imageUrl);
  };

  // Swipe handlers
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextImage();
    } else if (isRightSwipe) {
      prevImage();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-200"
      onClick={() => setIsModalOpen(false)}
    >
      <button
        onClick={() => setIsModalOpen(false)}
        className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-[10000] hover:bg-white/10 rounded-full transition-colors"
      >
        <X className="w-8 h-8" />
        <span className="sr-only">Close</span>
      </button>

      <button
        onClick={prevImage}
        className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-[10000] hidden md:flex items-center justify-center backdrop-blur-sm"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      <div
        className="relative w-full h-full max-w-7xl max-h-[90vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="relative w-full h-full">
          <Image
            src={activePreview}
            alt="Full screen preview"
            fill
            className="object-contain"
            quality={100}
            priority
            sizes="100vw"
          />
        </div>
      </div>

      <button
        onClick={nextImage}
        className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-[10000] hidden md:flex items-center justify-center backdrop-blur-sm"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Pagination Dots for Mobile */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 md:hidden z-[10000]">
        {allPreviews.map((_, idx) => (
          <div
            key={idx}
            className={cn(
              "w-2 h-2 rounded-full transition-colors shadow-sm",
              idx === currentIndex ? "bg-white scale-110" : "bg-white/40"
            )}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden bg-muted/20 rounded-xl">
        <div
          className="relative w-full max-w-md mx-auto cursor-zoom-in group"
          style={{ aspectRatio: 'auto' }}
          onClick={() => setIsModalOpen(true)}
        >
          {activePreview && (
            <Image
              src={activePreview}
              alt={`Preview of ${product.name}`}
              width={500}
              height={600}
              className="w-full h-auto object-contain"
              sizes="(max-width: 768px) 100vw, 40vw"
              data-ai-hint={allPreviews.find((p: any) => p.imageUrl === activePreview)?.imageHint}
              priority
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
                  "relative aspect-square overflow-hidden rounded-lg border-2 transition-all hover:opacity-90",
                  activePreview === preview.imageUrl
                    ? "border-primary ring-2 ring-primary ring-offset-1"
                    : "border-transparent bg-muted/50 hover:border-primary/50"
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

      {/* Render Modal via Portal */}
      {mounted && isModalOpen && createPortal(modalContent, document.body)}
    </div>
  );
}
