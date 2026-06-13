"use client";

import { useState } from "react";
import ProductList from "./components/ProductList";
import CartDrawer from "./components/CartDrawer";
import { useCart } from "./context/CartContext";

export default function Home() {
  const { totalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <main className="min-h-screen bg-amber-50">
      <div className="text-center py-8 relative">
        <h1 className="text-4xl font-bold text-amber-900 mb-2">
          ☕ Erawa Coffee
        </h1>
        <p className="text-amber-700">
          Kopi susu gula aren favorit, dibuat dengan hati.
        </p>

        <button
          onClick={() => setIsCartOpen(true)}
          className="absolute top-4 right-4 bg-amber-800 text-white px-4 py-2 rounded-full text-sm hover:bg-amber-900 transition"
        >
          🛒 {totalItems} item
        </button>
      </div>

      <ProductList />

      {isCartOpen && <CartDrawer onClose={() => setIsCartOpen(false)} />}
    </main>
  );
}