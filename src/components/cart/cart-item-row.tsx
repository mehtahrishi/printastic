"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Minus, Plus } from "lucide-react";
import { removeCartItem, updateCartItemQuantity } from "@/actions/cart";
import { useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart"; // Import useCart

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
  const { removeFromCart, updateQuantity: updateCartHook } = useCart(); // Get cart functions

  const getFirstImage = (images: any): string => {
    if (!images) return '/placeholder.jpg';
    
    if (Array.isArray(images)) {
      return images[0] || '/placeholder.jpg';
    }
    
    if (typeof images === 'string') {
      try {
        const parsed = JSON.parse(images);
        if (Array.isArray(parsed)) {
          return parsed[0] || '/placeholder.jpg';
        }
        return parsed || '/placeholder.jpg';
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
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
        setQuantity(item.quantity); // Revert on error
      } else {
        updateCartHook(String(item.product.id), newQuantity); // Update local state
      }
    });
  };

  const handleRemove = () => {
    startTransition(async () => {
      const result = await removeCartItem(item.id);
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        removeFromCart(String(item.product.id)); // Update local state
        toast({
          title: "Removed",
          description: "Item removed from cart",
        });
      }
    });
  };

  return (
    <div className="flex items-center gap-4 p-4">
      <Image
        src={imageUrl}
        alt={item.product.name}
        width={100}
        height={125}
        className="rounded-md object-cover aspect-[4/5]"
      />
      <div className="flex-1 min-w-0">
        <Link href={`/products/${item.product.slug}`} className="font-semibold hover:text-primary line-clamp-2">
          {item.product.name}
        </Link>
        <p className="text-sm text-muted-foreground">₹{price.toFixed(2)}</p>
        {item.size && <p className="text-xs text-muted-foreground">Size: {item.size}</p>}
        {item.color && <p className="text-xs text-muted-foreground">Color: {item.color}</p>}
      </div>
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
          className="w-16 h-8 text-center"
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
      <p className="font-semibold w-20 text-right">₹{(price * quantity).toFixed(2)}</p>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleRemove}
        disabled={isPending}
      >
        <Trash2 className="h-4 w-4 text-muted-foreground" />
        <span className="sr-only">Remove item</span>
      </Button>
    </div>
  );
}
