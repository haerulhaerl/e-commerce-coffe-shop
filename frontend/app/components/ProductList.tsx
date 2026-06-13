"use client";

import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import CustomizeModal from "./CustomizeModal";

// Tipe data sesuai response API (termasuk variants dari Prisma)
type Variant = {
  id: string;
  variantType: string;
  variantName: string;
  extraPrice: number;
};

type Product = {
  id: string;
  name: string;
  description: string | null;
  basePrice: number;
  category: string;
  isBestSeller: boolean;
  variants: Variant[];
};

const categories = ["Semua", "Coffee", "Non-Coffee", "Tea"];

export default function ProductList() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        if (!res.ok) throw new Error("Gagal memuat menu");
        const data = await res.json();
        setProducts(data.products);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat menu. Pastikan server backend berjalan.");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const filteredProducts =
    activeCategory === "Semua"
      ? products
      : products.filter((p) => p.category === activeCategory);

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

      {loading && <p className="text-amber-700">Memuat menu...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
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
      )}

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