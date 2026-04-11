import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);

  console.log('Seeding users...');

  // Admin
  await prisma.user.upsert({
    where: { phone: '+998901234567' },
    update: {},
    create: {
      phone: '+998901234567',
      name: 'Admin User',
      password: password,
      role: 'ADMIN',
    },
  });

  // Supplier
  await prisma.user.upsert({
    where: { phone: '+998907654321' },
    update: {},
    create: {
      phone: '+998907654321',
      name: 'Best Supplier',
      password: password,
      role: 'SUPPLIER',
    },
  });

  // Retailer
  await prisma.user.upsert({
    where: { phone: '+998901112233' },
    update: {},
    create: {
      phone: '+998901112233',
      name: 'City Market',
      password: password,
      role: 'RETAIL',
    },
  });

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
