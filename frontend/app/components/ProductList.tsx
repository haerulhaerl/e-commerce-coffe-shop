"use client";

import { useState } from "react";
import { useCart } from "../context/CartContext";
import CustomizeModal from "./CustomizeModal";

type Product = {
  id: string;
  name: string;
  basePrice: number;
  category: string;
  isBestSeller: boolean;
};

const dummyProducts: Product[] = [
  { id: "1", name: "Kopi Susu Gula Aren", basePrice: 18000, category: "Coffee", isBestSeller: true },
  { id: "2", name: "Americano", basePrice: 15000, category: "Coffee", isBestSeller: false },
  { id: "3", name: "Matcha Latte", basePrice: 22000, category: "Non-Coffee", isBestSeller: true },
  { id: "4", name: "Es Teh Lemon", basePrice: 12000, category: "Tea", isBestSeller: false },
  { id: "5", name: "Cappuccino", basePrice: 20000, category: "Coffee", isBestSeller: false },
];

const categories = ["Semua", "Coffee", "Non-Coffee", "Tea"];

export default function ProductList() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();

  const filteredProducts =
    activeCategory === "Semua"
      ? dummyProducts
      : dummyProducts.filter((p) => p.category === activeCategory);

  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-amber-900 mb-4">
        Menu Erawa Coffee
      </h2>

      <div className="flex gap-3 mb-6 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition
              ${
                activeCategory === cat
                  ? "bg-amber-800 text-white"
                  : "bg-amber-100 text-amber-800 border border-amber-200"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-sm border border-amber-100 p-4 hover:shadow-md transition relative"
          >
            {product.isBestSeller && (
              <span className="absolute top-2 right-2 bg-amber-600 text-white text-xs px-2 py-1 rounded-full">
                Best Seller
              </span>
            )}
            <h3 className="font-semibold text-amber-900">{product.name}</h3>
            <p className="text-amber-700 font-bold mt-1">
              Rp{product.basePrice.toLocaleString("id-ID")}
            </p>
            <button
              onClick={() => setSelectedProduct(product)}
              className="mt-3 w-full bg-amber-800 text-white text-sm py-2 rounded-lg hover:bg-amber-900 transition"
            >
              Tambah ke Keranjang
            </button>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <CustomizeModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onConfirm={(selectedVariants, extraPrice) => {
            addToCart({
              productId: selectedProduct.id,
              name: selectedProduct.name,
              unitPrice: selectedProduct.basePrice + extraPrice,
              selectedVariants,
            });
          }}
        />
      )}
    </section>
  );
}