"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  selectedVariants: {
    size: string;
    temperature: string;
    iceLevel: string;
    sugarLevel: string;
  };
};

type AddToCartInput = {
  productId: string;
  name: string;
  unitPrice: number;
  selectedVariants: {
    size: string;
    temperature: string;
    iceLevel: string;
    sugarLevel: string;
  };
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: AddToCartInput) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  totalItems: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  function addToCart(input: AddToCartInput) {
    const uniqueId = `${input.productId}-${input.selectedVariants.size}-${input.selectedVariants.temperature}-${input.selectedVariants.iceLevel}-${input.selectedVariants.sugarLevel}`;

    setItems((prev) => {
      const existing = prev.find((item) => item.id === uniqueId);

      if (existing) {
        return prev.map((item) =>
          item.id === uniqueId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...prev,
        {
          id: uniqueId,
          productId: input.productId,
          name: input.name,
          unitPrice: input.unitPrice,
          quantity: 1,
          selectedVariants: input.selectedVariants,
        },
      ];
    });
  }

  function removeFromCart(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function updateQuantity(id: string, quantity: number) {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, totalItems }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart harus dipakai di dalam CartProvider");
  }
  return context;
}