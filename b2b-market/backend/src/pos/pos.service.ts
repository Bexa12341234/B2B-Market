import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class POSService {
  constructor(private prisma: PrismaService) {}

  async createSession(retailId: number, items: any[]) {
    return this.prisma.pOSSession.create({
      data: {
        retailId,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            costPrice: item.costPrice, 
            price: item.price,
            total: item.quantity * item.price,
          })),
        },
      },
      include: { items: true },
    });
  }

  async getSessions(retailId: number) {
    return this.prisma.pOSSession.findMany({
      where: { retailId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteSession(id: number) {
    await this.prisma.pOSItem.deleteMany({ where: { sessionId: id } });
    return this.prisma.pOSSession.delete({
      where: { id },
    });
  }

  async getMyStock(retailId: number) {
    // Only products from CONFIRMED orders appear in the retailer's POS stock
    const orderItems = await this.prisma.orderItem.findMany({
      where: {
        order: {
          retailId: retailId,
          status: 'confirmed', // Only confirmed orders
        }
      },
      include: {
        product: {
          include: { category: true }
        }
      }
    });

    // 2. Get all sold items from POS sessions
    const soldItems = await this.prisma.pOSItem.findMany({
      where: {
        session: { retailId }
      }
    });

    // Group by product to get "stock" view
    const stockMap = new Map();
    
    // 1. Sum up all purchased quantities from confirmed orders
    orderItems.forEach(item => {
      const p = item.product;
      if (!p) return;
      if (!stockMap.has(p.id)) {
        stockMap.set(p.id, {
          ...p,
          purchasedPrice: item.price, // Last purchased price
          totalPurchasedQuantity: 0,
          totalSoldQuantity: 0,
          currentStock: 0
        });
      }
      stockMap.get(p.id).totalPurchasedQuantity += item.quantity;
    });

    // 2. Subtract all sold quantities from POS sessions
    soldItems.forEach(item => {
      if (item.productId && stockMap.has(item.productId)) {
        stockMap.get(item.productId).totalSoldQuantity += item.quantity;
      }
    });

    // 3. Calculate final current stock
    const results = Array.from(stockMap.values()).map(p => ({
      ...p,
      currentStock: p.totalPurchasedQuantity - p.totalSoldQuantity,
      purchasedPrice: p.purchasedPrice // Ensure we have the cost price
    }));

    return results;
  }
}
