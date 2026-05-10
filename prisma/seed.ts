import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Seed Cities
  await prisma.city.createMany({
    data: [
      { name: "Paris", country: "France", costIndex: 2.1, imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34" },
      { name: "Tokyo", country: "Japan", costIndex: 1.8, imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4de529484" },
      { name: "New York", country: "USA", costIndex: 2.3 },
      { name: "Bali", country: "Indonesia", costIndex: 1.2 },
      { name: "Rome", country: "Italy", costIndex: 1.9 },
      { name: "Bangkok", country: "Thailand", costIndex: 1.1 },
      { name: "London", country: "UK", costIndex: 2.0 },
      { name: "Dubai", country: "UAE", costIndex: 2.2 },
    ],
    skipDuplicates: true,
  })

  console.log('✅ Cities seeded successfully')
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())
