"use client";

import { useState } from "react";
import Navbar from "./components/navbar";
import ProductList from "./components/ProductList";
import CartDrawer from "./components/CartDrawer";

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <main className="min-h-screen bg-amber-50">
      <Navbar onCartClick={() => setIsCartOpen(true)} />

      <section className="pt-32 pb-16 px-4 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-amber-600 text-sm font-medium tracking-wide uppercase mb-3">
              Dari Hati, Untuk Setiap Tegukan
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-amber-900 leading-tight mb-4">
              Kopi Susu Gula Aren{" "}
              <span className="italic text-amber-700">Favoritmu</span>, Selalu
              Dekat
            </h1>
            <p className="text-amber-700 text-lg mb-8 max-w-md">
              Erawa Coffee menghadirkan kopi sederhana yang konsisten, dibuat
              dengan bahan segar dan sepenuh hati untuk menemani harimu.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <a
                href="#menu"
                className="bg-amber-800 text-white px-6 py-3 rounded-full font-medium hover:bg-amber-900 transition"
              >
                Lihat Menu →
              </a>
              <a
                href="#tentang"
                className="border border-amber-300 text-amber-800 px-6 py-3 rounded-full font-medium hover:bg-amber-100 transition"
              >
                Tentang Kami
              </a>
            </div>

            <div className="flex gap-8">
              <div>
                <p className="text-2xl font-bold text-amber-900">5+</p>
                <p className="text-sm text-amber-600">Menu Pilihan</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-900">100%</p>
                <p className="text-sm text-amber-600">Bahan Segar</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-900">
                  Setiap Hari
                </p>
                <p className="text-sm text-amber-600">Buka Melayani</p>
              </div>
            </div>
          </div>

          <div className="relative h-80 md:h-96 rounded-3xl bg-amber-100 flex items-center justify-center text-6xl overflow-hidden">
            ☕
          </div>
        </div>
      </section>

      <ProductList />

      <section
        id="tentang"
        className="bg-amber-900 text-amber-50 py-16 px-4 scroll-mt-20"
      >
        <div className="max-w-5xl mx-auto">
          <p className="text-amber-400 text-sm font-medium uppercase tracking-wide mb-3">
            Cerita Kami
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-snug">
            Kopi yang dibuat{" "}
            <span className="italic text-amber-300">dengan hati</span>, untuk
            setiap pelanggan setia.
          </h2>
          <p className="text-amber-200 max-w-2xl mb-12 leading-relaxed">
            Erawa Coffee lahir dari kecintaan pada kopi sederhana namun
            berkualitas. Setiap cangkir dibuat dengan bahan segar dan resep
            konsisten, agar siapa pun yang menikmatinya merasa seperti di
            rumah.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <p className="font-bold text-amber-300 mb-1">Bahan Segar</p>
              <p className="text-sm text-amber-200">
                Dipilih langsung setiap hari
              </p>
            </div>
            <div>
              <p className="font-bold text-amber-300 mb-1">Gula Aren Asli</p>
              <p className="text-sm text-amber-200">
                Manis alami, bukan sirup biasa
              </p>
            </div>
            <div>
              <p className="font-bold text-amber-300 mb-1">Cepat & Ramah</p>
              <p className="text-sm text-amber-200">Pelayanan sepenuh hati</p>
            </div>
            <div>
              <p className="font-bold text-amber-300 mb-1">
                Harga Terjangkau
              </p>
              <p className="text-sm text-amber-200">Kopi enak untuk semua</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-amber-50 border-t border-amber-100 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-amber-900 font-bold">☕ Erawa Coffee</p>
          <p className="text-sm text-amber-600">
            Buka setiap hari, 08.00 – 21.00 WIB
          </p>
          <p className="text-sm text-amber-500">
            © {new Date().getFullYear()} Erawa Coffee. All rights reserved.
          </p>
        </div>
      </footer>

      {isCartOpen && <CartDrawer onClose={() => setIsCartOpen(false)} />}
    </main>
  );
}