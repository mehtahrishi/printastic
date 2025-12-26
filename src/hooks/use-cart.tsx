
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useTransition } from "react";
import { getCartCount, getCartItems, addToCart as addToCartAction, removeCartItem, updateCartItemQuantity } from "@/actions/cart";
import { useToast } from "./use-toast";
import type { Product } from "@/lib/types";

// This is the type of the item that comes from the getCartItems server action
type CartDbItem = Awaited<ReturnType<typeof getCartItems>>[0];

interface CartContextType {
  cartItems: CartDbItem[];
  itemCount: number;
  isLoading: boolean;
  isUpdating: boolean;
  refetchCart: () => void;
  addToCart: (productId: number, quantity?: number, options?: { size?: string; color?: string }) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartDbItem[]>([]);
  const [itemCount, setItemCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, startTransition] = useTransition();
  const { toast } = useToast();

  const fetchCartData = useCallback(async () => {
    try {
      const [items, count] = await Promise.all([getCartItems(), getCartCount()]);
      setCartItems(items);
      setItemCount(count);
    } catch (error) {
      console.error("Failed to fetch cart data:", error);
      toast({ title: "Error", description: "Could not load your cart.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCartData();
  }, [fetchCartData]);
  
  const refetchCart = useCallback(() => {
    startTransition(() => {
        fetchCartData();
    });
  }, [fetchCartData]);

  const addToCart = async (productId: number, quantity = 1, options?: { size?: string; color?: string }) => {
    startTransition(async () => {
      const result = await addToCartAction(productId, quantity, options);
      if (result.error) {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      } else {
        toast({ title: "Success", description: result.success });
        await fetchCartData();
      }
    });
  };
  
  const removeFromCart = async (cartItemId: number) => {
    startTransition(async () => {
      const result = await removeCartItem(cartItemId);
      if (result.error) {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      } else {
        toast({ title: "Success", description: result.success });
        await fetchCartData();
      }
    });
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
     startTransition(async () => {
        const result = await updateCartItemQuantity(cartItemId, quantity);
        if (result.error) {
          toast({ title: "Error", description: result.error, variant: "destructive" });
        } else {
          await fetchCartData();
        }
     });
  };
  
  const clearCart = async () => {
      startTransition(async () => {
        // This is assuming you have a `clearCart` action
        // await clearCartAction(); 
        await fetchCartData();
      });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        itemCount,
        isLoading,
        isUpdating,
        refetchCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
