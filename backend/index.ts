import "dotenv/config";
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));