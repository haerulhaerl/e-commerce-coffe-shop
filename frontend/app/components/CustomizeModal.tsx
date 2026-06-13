"use client";

import { useState } from "react";

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

type CustomizeModalProps = {
  product: Product;
  onClose: () => void;
  onConfirm: (
    selectedVariants: {
      size: string;
      temperature: string;
      iceLevel: string;
      sugarLevel: string;
    },
    extraPrice: number
  ) => void;
};

const defaultSizeOptions = [{ id: "default-size", variantType: "size", variantName: "Regular", extraPrice: 0 }];
const defaultTempOptions = [{ id: "default-temp", variantType: "temperature", variantName: "Iced", extraPrice: 0 }];
const defaultIceOptions = [{ id: "default-ice", variantType: "ice_level", variantName: "Normal Ice", extraPrice: 0 }];
const defaultSugarOptions = [{ id: "default-sugar", variantType: "sugar_level", variantName: "Normal (100%)", extraPrice: 0 }];

export default function CustomizeModal({
  product,
  onClose,
  onConfirm,
}: CustomizeModalProps) {
  const sizeOptions = product.variants.filter((v) => v.variantType === "size");
  const tempOptions = product.variants.filter((v) => v.variantType === "temperature");
  const iceOptions = product.variants.filter((v) => v.variantType === "ice_level");
  const sugarOptions = product.variants.filter((v) => v.variantType === "sugar_level");

  const finalSizeOptions = sizeOptions.length > 0 ? sizeOptions : defaultSizeOptions;
  const finalTempOptions = tempOptions.length > 0 ? tempOptions : defaultTempOptions;
  const finalIceOptions = iceOptions.length > 0 ? iceOptions : defaultIceOptions;
  const finalSugarOptions = sugarOptions.length > 0 ? sugarOptions : defaultSugarOptions;

  const [size, setSize] = useState(finalSizeOptions[0].variantName);
  const [temperature, setTemperature] = useState(finalTempOptions[0].variantName);
  const [iceLevel, setIceLevel] = useState(finalIceOptions[0].variantName);
  const [sugarLevel, setSugarLevel] = useState(finalSugarOptions[0].variantName);

  // Tampilkan pilihan "Tingkat Es" hanya jika produk punya opsi temperature DAN "Iced" yang dipilih
  const hasTemperatureOption = tempOptions.length > 0;
  const showIceLevel = !hasTemperatureOption || temperature === "Iced";

  const sizeExtra = finalSizeOptions.find((s) => s.variantName === size)?.extraPrice || 0;
  const tempExtra = finalTempOptions.find((s) => s.variantName === temperature)?.extraPrice || 0;
  const iceExtra = finalIceOptions.find((s) => s.variantName === iceLevel)?.extraPrice || 0;
  const sugarExtra = finalSugarOptions.find((s) => s.variantName === sugarLevel)?.extraPrice || 0;
  const totalExtraPrice = sizeExtra + tempExtra + iceExtra + sugarExtra;

  const totalPrice = product.basePrice + totalExtraPrice;

  function handleConfirm() {
    onConfirm(
      {
        size,
        temperature,
        // Jika Hot dipilih, iceLevel tidak relevan
        iceLevel: showIceLevel ? iceLevel : "-",
        sugarLevel,
      },
      totalExtraPrice
    );
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-amber-900 mb-1">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-amber-600 text-sm mb-2">{product.description}</p>
        )}
        <p className="text-amber-700 mb-4">Sesuaikan pesananmu</p>

        {/* Pilihan Ukuran */}
        <div className="mb-4">
          <p className="font-medium text-amber-900 mb-2">Ukuran</p>
          <div className="flex gap-2 flex-wrap">
            {finalSizeOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSize(opt.variantName)}
                className={`px-3 py-2 rounded-lg border text-sm transition
                  ${
                    size === opt.variantName
                      ? "bg-amber-800 text-white border-amber-800"
                      : "bg-amber-50 text-amber-800 border-amber-200"
                  }`}
              >
                {opt.variantName}
                {opt.extraPrice > 0 && ` (+Rp${opt.extraPrice.toLocaleString("id-ID")})`}
              </button>
            ))}
          </div>
        </div>

        {/* Pilihan Hot/Iced, hanya tampil jika produk punya opsi ini */}
        {hasTemperatureOption && (
          <div className="mb-4">
            <p className="font-medium text-amber-900 mb-2">Sajian</p>
            <div className="flex gap-2 flex-wrap">
              {finalTempOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setTemperature(opt.variantName)}
                  className={`px-3 py-2 rounded-lg border text-sm transition
                    ${
                      temperature === opt.variantName
                        ? "bg-amber-800 text-white border-amber-800"
                        : "bg-amber-50 text-amber-800 border-amber-200"
                    }`}
                >
                  {opt.variantName === "Iced" ? "Dingin (Iced)" : "Panas (Hot)"}
                  {opt.extraPrice > 0 && ` (+Rp${opt.extraPrice.toLocaleString("id-ID")})`}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Pilihan Level Es, hanya tampil jika relevan (Iced atau produk tidak punya opsi temperature) */}
        {showIceLevel && (
          <div className="mb-4">
            <p className="font-medium text-amber-900 mb-2">Tingkat Es</p>
            <div className="flex gap-2 flex-wrap">
              {finalIceOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setIceLevel(opt.variantName)}
                  className={`px-3 py-2 rounded-lg border text-sm transition
                    ${
                      iceLevel === opt.variantName
                        ? "bg-amber-800 text-white border-amber-800"
                        : "bg-amber-50 text-amber-800 border-amber-200"
                    }`}
                >
                  {opt.variantName}
                  {opt.extraPrice > 0 && ` (+Rp${opt.extraPrice.toLocaleString("id-ID")})`}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Pilihan Level Gula */}
        <div className="mb-6">
          <p className="font-medium text-amber-900 mb-2">Tingkat Gula</p>
          <div className="flex gap-2 flex-wrap">
            {finalSugarOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSugarLevel(opt.variantName)}
                className={`px-3 py-2 rounded-lg border text-sm transition
                  ${
                    sugarLevel === opt.variantName
                      ? "bg-amber-800 text-white border-amber-800"
                      : "bg-amber-50 text-amber-800 border-amber-200"
                  }`}
              >
                {opt.variantName}
                {opt.extraPrice > 0 && ` (+Rp${opt.extraPrice.toLocaleString("id-ID")})`}
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