"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type OrderItem = {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  selectedVariants: {
    size: string;
    temperature: string;
    iceLevel: string;
    sugarLevel: string;
  };
  notes: string | null;
};

type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  address: string | null;
  notes: string | null;
  orderType: string;
  status: string;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
};

const statusOptions = [
  { value: "pending", label: "Menunggu", color: "bg-gray-200 text-gray-800" },
  { value: "processing", label: "Diproses", color: "bg-blue-200 text-blue-800" },
  { value: "ready", label: "Siap Diambil", color: "bg-green-200 text-green-800" },
  { value: "delivering", label: "Sedang Diantar", color: "bg-purple-200 text-purple-800" },
  { value: "completed", label: "Selesai", color: "bg-emerald-200 text-emerald-800" },
  { value: "cancelled", label: "Dibatalkan", color: "bg-red-200 text-red-800" },
];

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function getToken() {
    return localStorage.getItem("erawa_admin_token");
  }

  async function fetchOrders() {
    const token = getToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        localStorage.removeItem("erawa_admin_token");
        router.push("/admin/login");
        return;
      }

      if (!res.ok) throw new Error("Gagal memuat pesanan");
      const data = await res.json();
      setOrders(data.orders);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat pesanan. Pastikan server backend berjalan.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  async function handleStatusChange(orderId: string, newStatus: string) {
    const token = getToken();
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Gagal update status");

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error(err);
      alert("Gagal memperbarui status pesanan.");
    }
  }

  function handleLogout() {
    localStorage.removeItem("erawa_admin_token");
    router.push("/admin/login");
  }

  function getStatusStyle(status: string) {
    return statusOptions.find((s) => s.value === status)?.color || "bg-gray-200 text-gray-800";
  }

  return (
    <main className="min-h-screen bg-amber-50 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-amber-900">Dashboard Pesanan</h1>
          <div className="flex gap-2">
            <button
              onClick={fetchOrders}
              className="bg-amber-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-amber-900 transition"
            >
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="border border-amber-300 text-amber-800 px-4 py-2 rounded-lg text-sm hover:bg-amber-100 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {loading && <p className="text-amber-700">Memuat pesanan...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && orders.length === 0 && (
          <p className="text-amber-700">Belum ada pesanan masuk.</p>
        )}

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-amber-100 p-4"
            >
              <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                <div>
                  <p className="font-bold text-amber-900">{order.orderNumber}</p>
                  <p className="text-sm text-amber-600">
                    {new Date(order.createdAt).toLocaleString("id-ID")}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusStyle(order.status)}`}
                >
                  {statusOptions.find((s) => s.value === order.status)?.label || order.status}
                </span>
              </div>

              <div className="text-sm text-amber-800 mb-3 space-y-1">
                <p><span className="font-medium">Nama:</span> {order.customerName}</p>
                <p><span className="font-medium">WA:</span> {order.customerPhone}</p>
                <p><span className="font-medium">Metode:</span> {order.orderType === "pickup" ? "Ambil di Tempat" : "Diantar"}</p>
                {order.address && (
                  <p><span className="font-medium">Alamat:</span> {order.address}</p>
                )}
                {order.notes && (
                  <p><span className="font-medium">Catatan:</span> {order.notes}</p>
                )}
              </div>

              <div className="border-t border-amber-100 pt-3 space-y-1 mb-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div>
                      <p className="text-amber-900">
                        {item.productName} x{item.quantity}
                      </p>
                      <p className="text-amber-600 text-xs">
                        {item.selectedVariants.size} • {item.selectedVariants.temperature}
                        {item.selectedVariants.iceLevel !== "-" && ` • ${item.selectedVariants.iceLevel}`}
                        {" "}• Gula {item.selectedVariants.sugarLevel}
                      </p>
                    </div>
                    <p className="text-amber-800">
                      Rp{(item.unitPrice * item.quantity).toLocaleString("id-ID")}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap justify-between items-center gap-3 border-t border-amber-100 pt-3">
                <p className="font-bold text-amber-900">
                  Total: Rp{order.totalAmount.toLocaleString("id-ID")}
                </p>

                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className="text-sm border border-amber-200 rounded-lg px-3 py-2 text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}