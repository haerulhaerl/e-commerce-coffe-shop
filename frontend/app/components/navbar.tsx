"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";

type NavbarProps = {
  onCartClick: () => void;
};

export default function Navbar({ onCartClick }: NavbarProps) {
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${scrolled ? "bg-amber-50/90 backdrop-blur-md shadow-sm" : "bg-transparent"}`}
    >
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-amber-900">
          ☕ Erawa Coffee
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-amber-800">
          <a href="#menu" className="hover:text-amber-600 transition">
            Menu
          </a>
          <a href="#tentang" className="hover:text-amber-600 transition">
            Tentang Kami
          </a>
        </div>

        <button
          onClick={onCartClick}
          className="bg-amber-800 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-amber-900 transition"
        >
          🛒 {totalItems} item
        </button>
      </div>
    </nav>
  );
}