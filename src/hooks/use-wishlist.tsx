
"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import type { Product } from "@/lib/types";
import { getWishlistItems, addToWishlistAction, removeFromWishlistAction } from "@/actions/wishlist";
import { useToast } from "./use-toast";

// The WishlistItem now just holds the product, as it is fetched from the DB
export type WishlistItem = {
  product: Product;
};

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  itemCount: number;
  isLoading: boolean;
  refetch: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchWishlist = useCallback(async () => {
    setIsLoading(true);
    try {
      const items = await getWishlistItems();
      setWishlistItems(items.map(product => ({ product: product as Product })));
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
      toast({ title: "Error", description: "Could not load your wishlist.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = async (product: Product) => {
    const result = await addToWishlistAction(Number(product.id));
    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
      // Optimistically update UI
      setWishlistItems(prev => [...prev, { product }]);
      toast({ title: "Added to Wishlist", description: `${product.name} has been added.` });
    }
  };

  const removeFromWishlist = async (productId: string) => {
    const result = await removeFromWishlistAction(Number(productId));
    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
      const removedProduct = wishlistItems.find(item => item.product.id.toString() === productId);
      // Optimistically update UI
      setWishlistItems(prev => prev.filter(item => item.product.id.toString() !== productId));
      if (removedProduct) {
        toast({ title: "Removed from Wishlist", description: `${removedProduct.product.name} has been removed.` });
      }
    }
  };

  const isInWishlist = useCallback((productId: string) => {
    return wishlistItems.some((item) => item.product.id.toString() === productId);
  }, [wishlistItems]);

  const itemCount = useMemo(() => wishlistItems.length, [wishlistItems]);

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        itemCount,
        isLoading,
        refetch: fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
