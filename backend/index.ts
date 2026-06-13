import "dotenv/config";
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "erawa123";

app.use(cors());
app.use(express.json());

// Login admin sederhana
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;

  if (password === ADMIN_PASSWORD) {
    res.json({ token: "erawa-admin-token" });
  } else {
    res.status(401).json({ message: "Password salah." });
  }
});

app.get("/", (req, res) => {
  res.json({ message: "Erawa Coffee API berjalan 🚀" });
});
app.get("/", (req, res) => {
  res.json({ message: "Erawa Coffee API berjalan 🚀" });
});

// Ambil semua produk aktif beserta variannya
app.get("/api/products", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: { variants: true },
    });
    res.json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil produk" });
  }
});

// Buat pesanan baru (checkout)
app.post("/api/orders", async (req, res) => {
  try {
    const { customer, orderType, address, notes, items, subtotal, deliveryFee, total } = req.body;

    // Validasi dasar
    if (!customer?.name || !customer?.phone) {
      return res.status(400).json({ message: "Nama dan nomor WhatsApp wajib diisi." });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Keranjang tidak boleh kosong." });
    }

    // Generate order number unik
    const orderNumber = `ERW-${Date.now()}`;

    // Buat order beserta order_items dalam satu transaksi
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: customer.name,
        customerPhone: customer.phone,
        address: address || null,
        notes: notes || null,
        orderType,
        status: "pending",
        paymentStatus: "unpaid",
        subtotal,
        deliveryFee,
        totalAmount: total,
        // Simpan info pelanggan & alamat di kolom notes sementara
        // (karena belum ada sistem user/login)
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            productName: item.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            selectedVariants: item.selectedVariants,
            notes: null,
          })),
        },
      },
      include: { items: true },
    });

    res.status(201).json({
      message: "Pesanan berhasil dibuat.",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal membuat pesanan." });
  }
});

// Ambil semua pesanan (untuk admin), urutkan dari terbaru
app.get("/api/orders", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader !== "Bearer erawa-admin-token") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });
    res.json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil daftar pesanan" });
  }
});

// Update status pesanan
app.patch("/api/orders/:id/status", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader !== "Bearer erawa-admin-token") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { id } = req.params;
    const { status } = req.body;
    // ... sisanya tetap sama

    const validStatuses = ["pending", "processing", "ready", "delivering", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Status tidak valid." });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });

    res.json({ message: "Status pesanan diperbarui.", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal memperbarui status pesanan." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));