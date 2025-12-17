
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Minus, Plus } from "lucide-react";
import { removeCartItem, updateCartItemQuantity } from "@/actions/cart";
import { useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface CartItemRowProps {
  item: {
    id: number;
    quantity: number;
    size: string | null;
    color: string | null;
    product: {
      id: number;
      name: string;
      slug: string;
      description: string;
      price: string;
      originalPrice: string | null;
      images: string[];
      category: string | null;
    };
  };
}

export default function CartItemRow({ item }: CartItemRowProps) {
  const [isPending, startTransition] = useTransition();
  const [quantity, setQuantity] = useState(item.quantity);
  const { toast } = useToast();
  const { removeFromCart, updateQuantity: updateCartHook } = useCart();

  const getFirstImage = (images: any): string => {
    if (!images) return '/placeholder.jpg';
    if (Array.isArray(images)) return images[0] || '/placeholder.jpg';
    if (typeof images === 'string') {
      try {
        const parsed = JSON.parse(images);
        return Array.isArray(parsed) ? parsed[0] || '/placeholder.jpg' : '/placeholder.jpg';
      } catch {
        const urls = images.split(',').map(u => u.trim()).filter(Boolean);
        return urls[0] || '/placeholder.jpg';
      }
    }
    return '/placeholder.jpg';
  };

  const imageUrl = getFirstImage(item.product.images);
  const price = parseFloat(item.product.price);

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
    
    startTransition(async () => {
      const result = await updateCartItemQuantity(item.id, newQuantity);
      if (result.error) {
        toast({
          title: "Error updating cart",
          description: result.error,
          variant: "destructive",
        });
        setQuantity(item.quantity); // Revert on error
      } else {
        updateCartHook(String(item.product.id), newQuantity);
      }
    });
  };

  const handleRemove = () => {
    startTransition(async () => {
      const result = await removeCartItem(item.id);
      if (result.error) {
        toast({
          title: "Error removing item",
          description: result.error,
          variant: "destructive",
        });
      } else {
        removeFromCart(String(item.product.id));
        toast({
          title: "Item Removed",
          description: `${item.product.name} has been removed from your cart.`,
        });
      }
    });
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
          {/* --- Image --- */}
          <Link href={`/products/${item.product.slug}`} className="block shrink-0">
            <Image
              src={imageUrl}
              alt={item.product.name}
              width={120}
              height={150}
              className="w-full sm:w-[120px] sm:h-[150px] object-cover aspect-[4/5] sm:aspect-auto"
            />
          </Link>
          
          <div className="p-4 sm:p-0 sm:pr-4 flex-1 flex flex-col sm:flex-row sm:items-center gap-4">
            
            {/* --- Details --- */}
            <div className="flex-1 min-w-0">
              <Link href={`/products/${item.product.slug}`} className="font-semibold hover:text-primary leading-tight">
                {item.product.name}
              </Link>
              <div className="text-sm text-muted-foreground mt-1">
                {(item.size || item.color) && (
                  <span>
                    {item.size}
                    {item.size && item.color && ' / '}
                    {item.color}
                  </span>
                )}
              </div>
              <p className="sm:hidden text-base font-semibold text-primary mt-2">₹{(price * quantity).toFixed(2)}</p>
            </div>
            
            {/* --- Quantity Controls --- */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleUpdateQuantity(quantity - 1)}
                disabled={isPending || quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val > 0) {
                    handleUpdateQuantity(val);
                  }
                }}
                className="w-14 h-8 text-center"
                disabled={isPending}
              />
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleUpdateQuantity(quantity + 1)}
                disabled={isPending}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            {/* --- Total & Remove --- */}
            <div className="hidden sm:flex items-center gap-4">
              <p className="font-semibold w-24 text-right">₹{(price * quantity).toFixed(2)}</p>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleRemove}
                disabled={isPending}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove item</span>
              </Button>
            </div>

          </div>
        </div>
        {/* --- Mobile Remove Button --- */}
        <div className="sm:hidden p-2 border-t">
            <Button 
                variant="ghost" 
                size="sm"
                onClick={handleRemove}
                disabled={isPending}
                className="w-full justify-center text-muted-foreground"
            >
                <Trash2 className="h-4 w-4 mr-2"/>
                Remove
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
