"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";

export default function CheckoutPage() {
  const { items, removeFromCart } = useCart();
  const router = useRouter();

  // State form
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [orderType, setOrderType] = useState<"pickup" | "delivery">("pickup");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  // Hitung subtotal
  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  // Biaya pengiriman sederhana: gratis jika pickup, flat rate jika delivery
  const deliveryFee = orderType === "delivery" ? 8000 : 0;
  const total = subtotal + deliveryFee;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validasi dasar
    if (!name || !phone) {
      alert("Nama dan nomor WhatsApp wajib diisi.");
      return;
    }

    if (orderType === "delivery" && !address) {
      alert("Alamat pengiriman wajib diisi untuk opsi delivery.");
      return;
    }

    if (items.length === 0) {
      alert("Keranjang masih kosong.");
      return;
    }

    // Simulasi proses checkout (nanti diganti panggilan API + Midtrans)
    console.log("Order data:", {
      customer: { name, phone },
      orderType,
      address: orderType === "delivery" ? address : null,
      notes,
      items,
      subtotal,
      deliveryFee,
      total,
    });

    alert("Pesanan berhasil dibuat! (simulasi)");

    // Kosongkan keranjang setelah checkout
    items.forEach((item) => removeFromCart(item.id));

    // Arahkan kembali ke halaman utama
    router.push("/");
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-amber-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-amber-800 text-lg mb-4">
            Keranjang kamu masih kosong.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-amber-800 text-white px-6 py-2 rounded-lg hover:bg-amber-900 transition"
          >
            Kembali ke Menu
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-amber-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-amber-900 mb-6">Checkout</h1>

        {/* Ringkasan Pesanan */}
        <section className="bg-white rounded-2xl border border-amber-100 p-4 mb-6">
          <h2 className="font-semibold text-amber-900 mb-3">Ringkasan Pesanan</h2>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <div>
                  <p className="text-amber-900 font-medium">
                    {item.name} x{item.quantity}
                  </p>
                  <p className="text-amber-600">
                    {item.selectedVariants.size} • {item.selectedVariants.iceLevel} • Gula {item.selectedVariants.sugarLevel}
                  </p>
                </div>
                <p className="text-amber-800 font-medium">
                  Rp{(item.unitPrice * item.quantity).toLocaleString("id-ID")}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Form Data Pelanggan */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <section className="bg-white rounded-2xl border border-amber-100 p-4">
            <h2 className="font-semibold text-amber-900 mb-3">Data Pelanggan</h2>

            <div className="mb-3">
              <label className="block text-sm text-amber-800 mb-1">Nama</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama lengkap"
                className="w-full border border-amber-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-sm text-amber-800 mb-1">Nomor WhatsApp</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08xxxxxxxxxx"
                className="w-full border border-amber-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </section>

          {/* Opsi Pickup / Delivery */}
          <section className="bg-white rounded-2xl border border-amber-100 p-4">
            <h2 className="font-semibold text-amber-900 mb-3">Metode Pengambilan</h2>

            <div className="flex gap-3 mb-3">
              <button
                type="button"
                onClick={() => setOrderType("pickup")}
                className={`flex-1 px-4 py-2 rounded-lg border text-sm transition
                  ${
                    orderType === "pickup"
                      ? "bg-amber-800 text-white border-amber-800"
                      : "bg-amber-50 text-amber-800 border-amber-200"
                  }`}
              >
                Ambil di Tempat
              </button>
              <button
                type="button"
                onClick={() => setOrderType("delivery")}
                className={`flex-1 px-4 py-2 rounded-lg border text-sm transition
                  ${
                    orderType === "delivery"
                      ? "bg-amber-800 text-white border-amber-800"
                      : "bg-amber-50 text-amber-800 border-amber-200"
                  }`}
              >
                Diantar (+Rp8.000)
              </button>
            </div>

            {orderType === "delivery" && (
              <div>
                <label className="block text-sm text-amber-800 mb-1">Alamat Pengiriman</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Tulis alamat lengkap..."
                  rows={3}
                  className="w-full border border-amber-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            )}
          </section>

          {/* Catatan Tambahan */}
          <section className="bg-white rounded-2xl border border-amber-100 p-4">
            <label className="block text-sm text-amber-800 mb-1">Catatan (opsional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: tolong gulanya dipisah"
              rows={2}
              className="w-full border border-amber-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </section>

          {/* Total & Tombol Bayar */}
          <section className="bg-white rounded-2xl border border-amber-100 p-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-amber-700">Subtotal</span>
              <span className="text-amber-900">Rp{subtotal.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between text-sm mb-3">
              <span className="text-amber-700">Biaya Pengiriman</span>
              <span className="text-amber-900">Rp{deliveryFee.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t border-amber-100 pt-2 mb-4">
              <span className="text-amber-900">Total</span>
              <span className="text-amber-900">Rp{total.toLocaleString("id-ID")}</span>
            </div>

            <button
              type="submit"
              className="w-full bg-amber-800 text-white py-3 rounded-lg hover:bg-amber-900 transition font-medium"
            >
              Buat Pesanan
            </button>
          </section>
        </form>
      </div>
    </main>
  );
}