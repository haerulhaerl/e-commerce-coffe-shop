"use client";

import { useState } from "react";

type Product = {
  id: string;
  name: string;
  basePrice: number;
  category: string;
  isBestSeller: boolean;
};

type CustomizeModalProps = {
  product: Product;
  onClose: () => void;
  onConfirm: (
    selectedVariants: {
      size: string;
      iceLevel: string;
      sugarLevel: string;
    },
    extraPrice: number
  ) => void;
};

const sizeOptions = [
  { label: "Regular", extraPrice: 0 },
  { label: "Large", extraPrice: 5000 },
];

const iceLevelOptions = ["Normal Ice", "Less Ice", "No Ice"];
const sugarLevelOptions = ["100%", "75%", "50%", "25%", "0%"];

export default function CustomizeModal({
  product,
  onClose,
  onConfirm,
}: CustomizeModalProps) {
  const [size, setSize] = useState(sizeOptions[0].label);
  const [iceLevel, setIceLevel] = useState(iceLevelOptions[0]);
  const [sugarLevel, setSugarLevel] = useState(sugarLevelOptions[0]);

  const extraPrice =
    sizeOptions.find((s) => s.label === size)?.extraPrice || 0;
  const totalPrice = product.basePrice + extraPrice;

  function handleConfirm() {
    onConfirm({ size, iceLevel, sugarLevel }, extraPrice);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <h3 className="text-xl font-bold text-amber-900 mb-1">
          {product.name}
        </h3>
        <p className="text-amber-700 mb-4">Sesuaikan pesananmu</p>

        <div className="mb-4">
          <p className="font-medium text-amber-900 mb-2">Ukuran</p>
          <div className="flex gap-2">
            {sizeOptions.map((opt) => (
              <button
                key={opt.label}
                onClick={() => setSize(opt.label)}
                className={`flex-1 px-3 py-2 rounded-lg border text-sm transition
                  ${
                    size === opt.label
                      ? "bg-amber-800 text-white border-amber-800"
                      : "bg-amber-50 text-amber-800 border-amber-200"
                  }`}
              >
                {opt.label}
                {opt.extraPrice > 0 &&
                  ` (+Rp${opt.extraPrice.toLocaleString("id-ID")})`}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <p className="font-medium text-amber-900 mb-2">Tingkat Es</p>
          <div className="flex gap-2 flex-wrap">
            {iceLevelOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setIceLevel(opt)}
                className={`px-3 py-2 rounded-lg border text-sm transition
                  ${
                    iceLevel === opt
                      ? "bg-amber-800 text-white border-amber-800"
                      : "bg-amber-50 text-amber-800 border-amber-200"
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <p className="font-medium text-amber-900 mb-2">Tingkat Gula</p>
          <div className="flex gap-2 flex-wrap">
            {sugarLevelOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setSugarLevel(opt)}
                className={`px-3 py-2 rounded-lg border text-sm transition
                  ${
                    sugarLevel === opt
                      ? "bg-amber-800 text-white border-amber-800"
                      : "bg-amber-50 text-amber-800 border-amber-200"
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-amber-700">Total Harga</span>
          <span className="text-xl font-bold text-amber-900">
            Rp{totalPrice.toLocaleString("id-ID")}
          </span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-amber-300 text-amber-800 py-2 rounded-lg hover:bg-amber-50 transition"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 bg-amber-800 text-white py-2 rounded-lg hover:bg-amber-900 transition"
          >
            Tambah ke Keranjang
          </button>
        </div>
      </div>
    </div>
  );
}