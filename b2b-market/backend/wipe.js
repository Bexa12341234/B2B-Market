const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');

async function clean() {
  const adapter = new PrismaBetterSqlite3({ url: './dev.db' });
  const prisma = new PrismaClient({ adapter });

  try {
    console.log("Wiping databases...");
    await prisma.offerItem.deleteMany();
    await prisma.offer.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.pOSItem.deleteMany();
    await prisma.pOSSession.deleteMany();
    
    await prisma.product.deleteMany();
    
    await prisma.user.updateMany({ data: { segmentId: null } });
    await prisma.segment.deleteMany();
    
    console.log("Successfully deleted all products, segments, offers, orders.");
  } catch (err) {
    console.error("Error cleaning:", err);
  } finally {
    await prisma.$disconnect();
  }
}

clean();
