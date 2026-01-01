
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { Card, CardContent } from "@/components/ui/card";

interface CartItemRowProps {
  item: {
    id: number;
    quantity: number;
    size: string | null;
    color: string | null;
    gsm: string | null;
    product: {
      id: number;
      name: string;
      slug: string;
      description: string;
      price: string;
      originalPrice: string | null;
      gsm180Price?: string | null;
      gsm240Price?: string | null;
      images: string[];
      category: string | null;
    };
  };
}

export default function CartItemRow({ item }: CartItemRowProps) {
  const { removeFromCart, updateQuantity, isUpdating } = useCart();

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

  // Calculate the correct price based on GSM selection
  const getItemPrice = () => {
    // Check if product has GSM pricing and item has GSM selected
    if (item.gsm && item.product.gsm180Price && item.product.gsm240Price) {
      if (item.gsm === "180") return parseFloat(item.product.gsm180Price);
      if (item.gsm === "240") return parseFloat(item.product.gsm240Price);
    }
    
    return parseFloat(item.product.price);
  };

  const imageUrl = getFirstImage(item.product.images);
  const price = getItemPrice();

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(item.id, newQuantity);
  };

  const handleRemove = () => {
    removeFromCart(item.id);
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
                {(item.size || item.gsm || item.color) && (
                  <span>
                    {item.size}
                    {item.gsm && <span className="ml-1">({item.gsm} GSM)</span>}
                    {(item.size || item.gsm) && item.color && ' / '}
                    {item.color}
                  </span>
                )}
              </div>
              <p className="sm:hidden text-base font-semibold text-primary mt-2">₹{(price * item.quantity).toFixed(2)}</p>
            </div>
            
            {/* --- Quantity Controls --- */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleUpdateQuantity(item.quantity - 1)}
                disabled={isUpdating || item.quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <Input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val > 0) {
                    handleUpdateQuantity(val);
                  }
                }}
                className="w-14 h-8 text-center"
                disabled={isUpdating}
              />
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleUpdateQuantity(item.quantity + 1)}
                disabled={isUpdating}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            {/* --- Total & Remove --- */}
            <div className="hidden sm:flex items-center gap-4">
              <p className="font-semibold w-24 text-right">₹{(price * item.quantity).toFixed(2)}</p>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleRemove}
                disabled={isUpdating}
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
                disabled={isUpdating}
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
