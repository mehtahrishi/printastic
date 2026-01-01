import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

interface ColorVariant {
  id: number;
  name: string;
  slug: string;
  images: string | string[];
  price: string;
  gsm180Price?: string;
  gsm240Price?: string;
}

function parseJsonOrString(data: any): string[] {
  if (Array.isArray(data)) return data;
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      return data.split(',').map(s => s.trim()).filter(Boolean);
    }
  }
  return [];
}

export function ColorVariantsSection({ variants }: { variants: ColorVariant[] }) {
  console.log('[ColorVariantsSection] Received variants:', variants.length, variants);
  
  if (!variants || variants.length === 0) {
    console.log('[ColorVariantsSection] No variants to display, hiding section');
    return null;
  }

  return (
    <div className="mt-12 mb-8">
      <h2 className="text-2xl font-bold mb-6">🎨 Available in Other Colors</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {variants.map((variant) => {
          const images = parseJsonOrString(variant.images);
          const firstImage = images[0] || '/placeholder.png';
          
          return (
            <Link key={variant.id} href={`/products/${variant.slug}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-2">
                  <div className="aspect-square relative mb-2 overflow-hidden rounded-md bg-gray-100">
                    <Image
                      src={firstImage}
                      alt={variant.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <p className="text-sm font-medium text-center line-clamp-2 min-h-[2.5rem]">
                    {variant.name}
                  </p>
                  <p className="text-sm text-center text-muted-foreground mt-1">
                    {variant.gsm180Price && variant.gsm240Price ? (
                      `₹${variant.gsm180Price} - ₹${variant.gsm240Price}`
                    ) : (
                      `₹${variant.price}`
                    )}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
