"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useCart } from "../context/CartContext";
import CustomizeModal from "./CustomizeModal";

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
  imageUrl: string | null;
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
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiUrl}/api/products`);
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
    <section id="menu" className="max-w-6xl mx-auto px-4 py-16 scroll-mt-20">
      <div className="text-center mb-10">
        <p className="text-amber-600 text-sm font-medium tracking-wide uppercase mb-2">
          Pilihan Terbaik
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-amber-900">
          Menu Favorit Kami
        </h2>
      </div>

      <div className="flex gap-3 mb-10 justify-center flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition
              ${
                activeCategory === cat
                  ? "bg-amber-800 text-white"
                  : "bg-white text-amber-800 border border-amber-200 hover:border-amber-400"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && <p className="text-amber-700 text-center">Memuat menu...</p>}
      {error && <p className="text-red-600 text-center">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden hover:shadow-lg transition group"
            >
              {/* Gambar produk */}
              <div className="relative w-full h-56 bg-amber-100">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    ☕
                  </div>
                )}

                {product.isBestSeller && (
                  <span className="absolute top-3 left-3 bg-amber-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                    Best Seller
                  </span>
                )}

                {/* Harga sebagai tag di gambar */}
                <span className="absolute bottom-3 right-3 bg-amber-900 text-white text-sm font-bold px-3 py-1.5 rounded-full">
                  Rp{product.basePrice.toLocaleString("id-ID")}
                </span>
              </div>

              {/* Info produk */}
              <div className="p-5">
                <p className="text-amber-500 text-xs font-medium uppercase tracking-wide mb-1">
                  {product.category}
                </p>
                <h3 className="font-bold text-amber-900 text-lg mb-1">
                  {product.name}
                </h3>
                {product.description && (
                  <p className="text-amber-700 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                )}
                <button
                  onClick={() => setSelectedProduct(product)}
                  className="w-full bg-amber-800 text-white text-sm py-2.5 rounded-lg hover:bg-amber-900 transition font-medium"
                >
                  Tambah ke Keranjang
                </button>
              </div>
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