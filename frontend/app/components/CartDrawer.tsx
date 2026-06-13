"use client";

import { useCart } from "../context/CartContext";
import Link from "next/link";

type CartDrawerProps = {
  onClose: () => void;
};

export default function CartDrawer({ onClose }: CartDrawerProps) {
  const { items, totalItems, removeFromCart, updateQuantity } = useCart();

  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 flex flex-col shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-amber-100">
          <h2 className="text-lg font-bold text-amber-900">
            Keranjang ({totalItems})
          </h2>
          <button
            onClick={onClose}
            className="text-amber-700 hover:text-amber-900 text-xl"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <p className="text-amber-700 text-center mt-8">
              Keranjang masih kosong. Yuk pilih menu favoritmu!
            </p>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="border border-amber-100 rounded-xl p-3"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-amber-900">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-800 font-bold">
                        Rp{(item.unitPrice * item.quantity).toLocaleString("id-ID")}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                        title="Hapus item"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-amber-600 mt-1">
                    {item.selectedVariants.size} • {item.selectedVariants.iceLevel} • Gula {item.selectedVariants.sugarLevel}
                  </p>

                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center border border-amber-300 rounded-full text-amber-800 hover:bg-amber-50"
                    >
                      −
                    </button>
                    <span className="text-amber-900 font-medium w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center border border-amber-300 rounded-full text-amber-800 hover:bg-amber-50"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-amber-100 p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-amber-700">Subtotal</span>
              <span className="text-xl font-bold text-amber-900">
                Rp{subtotal.toLocaleString("id-ID")}
              </span>
            </div>
            <Link
  href="/checkout"
  className="block w-full text-center bg-amber-800 text-white py-3 rounded-lg hover:bg-amber-900 transition font-medium"
>
  Lanjut ke Checkout
</Link>
          </div>
        )}
      </div>
    </>
  );
}