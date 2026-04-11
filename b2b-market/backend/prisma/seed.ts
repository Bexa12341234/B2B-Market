import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  console.log('Clearing old data...');
  // Since I force reset db push, it might already be empty, but let's be safe.
  
  // 1. Create Segments
  const pharmacy = await prisma.segment.upsert({
    where: { name: 'Pharmacies' },
    update: {},
    create: { name: 'Pharmacies' },
  });

  const shop = await prisma.segment.upsert({
    where: { name: 'General Shops' },
    update: {},
    create: { name: 'General Shops' },
  });

  // 2. Create Users
  await prisma.user.upsert({
    where: { phone: '+998901234567' },
    update: {},
    create: {
      phone: '+998901234567',
      name: 'System Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  const supplier = await prisma.user.upsert({
    where: { phone: '+998907654321' },
    update: {},
    create: {
      phone: '+998907654321',
      name: 'PharmaCorp Inc.',
      password: hashedPassword,
      role: 'SUPPLIER',
    },
  });

  const retail = await prisma.user.upsert({
    where: { phone: '+998901112233' },
    update: {},
    create: {
      phone: '+998901112233',
      name: 'City Pharmacy #1',
      password: hashedPassword,
      role: 'RETAIL',
      segmentId: pharmacy.id,
    },
  });

  // 3. Create Categories
  const meds = await prisma.category.upsert({
    where: { name: 'Medications' },
    update: {},
    create: { name: 'Medications' },
  });

  // 4. Create Products
  await prisma.product.create({
    data: {
      name: 'Paracetamol 500mg',
      brand: 'HealthFirst',
      basePrice: 5.0,
      categoryId: meds.id,
      supplierId: supplier.id,
      segments: {
        connect: [{ id: pharmacy.id }]
      }
    },
  });

  await prisma.product.create({
    data: {
      name: 'Vitamin C 1000mg',
      brand: 'VitaLife',
      basePrice: 12.0,
      categoryId: meds.id,
      supplierId: supplier.id,
      segments: {
        connect: [{ id: pharmacy.id }, { id: shop.id }]
      }
    },
  });

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
