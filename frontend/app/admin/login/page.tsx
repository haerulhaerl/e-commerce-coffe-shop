"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "../../lib/api";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Login gagal.");
        return;
      }

      const data = await res.json();
      localStorage.setItem("erawa_admin_token", data.token);
      router.push("/admin");
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan, coba lagi.");
    }
  }

  return (
    <main className="min-h-screen bg-amber-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-amber-100 p-6 w-full max-w-sm">
        <h1 className="text-xl font-bold text-amber-900 mb-4 text-center">
          ☕ Admin Erawa Coffee
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-amber-800 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-black border border-amber-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="Masukkan password admin"
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-amber-800 text-white py-2 rounded-lg hover:bg-amber-900 transition font-medium"
          >
            Masuk
          </button>
        </form>
      </div>
    </main>
  );
}