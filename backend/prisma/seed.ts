import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Memulai proses seeding (mengisi data awal)...')

  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.productVariant.deleteMany()
  await prisma.product.deleteMany()

  // Varian standar: size, temperature (Hot/Iced), ice_level (hanya relevan jika Iced), sugar_level
  const standardVariants = [
    { variantType: 'size', variantName: 'Regular', extraPrice: 0 },
    { variantType: 'size', variantName: 'Large', extraPrice: 5000 },
    { variantType: 'temperature', variantName: 'Iced', extraPrice: 0 },
    { variantType: 'temperature', variantName: 'Hot', extraPrice: 0 },
    { variantType: 'ice_level', variantName: 'Normal Ice', extraPrice: 0 },
    { variantType: 'ice_level', variantName: 'Less Ice', extraPrice: 0 },
    { variantType: 'ice_level', variantName: 'No Ice', extraPrice: 0 },
    { variantType: 'sugar_level', variantName: 'Normal (100%)', extraPrice: 0 },
    { variantType: 'sugar_level', variantName: 'Less Sugar (50%)', extraPrice: 0 },
    { variantType: 'sugar_level', variantName: 'No Sugar (0%)', extraPrice: 0 },
  ]

  // Untuk minuman yang hanya tersedia dingin (misal Es Teh Lemon)
  const coldOnlyVariants = [
    { variantType: 'size', variantName: 'Regular', extraPrice: 0 },
    { variantType: 'size', variantName: 'Large', extraPrice: 5000 },
    { variantType: 'ice_level', variantName: 'Normal Ice', extraPrice: 0 },
    { variantType: 'ice_level', variantName: 'Less Ice', extraPrice: 0 },
    { variantType: 'ice_level', variantName: 'No Ice', extraPrice: 0 },
    { variantType: 'sugar_level', variantName: 'Normal (100%)', extraPrice: 0 },
    { variantType: 'sugar_level', variantName: 'Less Sugar (50%)', extraPrice: 0 },
    { variantType: 'sugar_level', variantName: 'No Sugar (0%)', extraPrice: 0 },
  ]

  await prisma.product.create({
    data: {
      name: 'Kopi Susu Gula Aren',
      description: 'Perpaduan sempurna espresso blend Erawa, susu segar, dan manisnya gula aren murni.',
      basePrice: 18000,
      category: 'Coffee',
      isBestSeller: true,
      imageUrl: '/images/gula-aren.jpg',
      variants: { create: standardVariants },
    },
  })

  await prisma.product.create({
    data: {
      name: 'Americano',
      description: 'Espresso double shot dengan air murni segar. Pilihan tepat untuk penyuka kopi hitam.',
      basePrice: 15000,
      category: 'Coffee',
      isBestSeller: false,
      variants: { create: standardVariants },
    },
  })

  await prisma.product.create({
    data: {
      name: 'Matcha Latte',
      description: 'Serbuk matcha premium dari Jepang dipadukan dengan susu segar yang creamy.',
      basePrice: 22000,
      category: 'Non-Coffee',
      isBestSeller: true,
      variants: { create: standardVariants },
    },
  })

  await prisma.product.create({
    data: {
      name: 'Es Teh Lemon',
      description: 'Kesegaran teh asli berpadu dengan perasan lemon segar asli.',
      basePrice: 12000,
      category: 'Tea',
      isBestSeller: false,
      variants: { create: coldOnlyVariants },
    },
  })

  await prisma.product.create({
    data: {
      name: 'Cappuccino',
      description: 'Espresso klasik dengan steamed milk dan foam tebal.',
      basePrice: 20000,
      category: 'Coffee',
      isBestSeller: false,
      variants: { create: standardVariants },
    },
  })

  console.log('✅ Seeding berhasil! Menu Erawa Coffee sudah masuk ke database Neon.')
}

main()
  .catch((e) => {
    console.error('Terjadi kesalahan saat seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })