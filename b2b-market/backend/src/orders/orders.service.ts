import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(retailId: number, data: any) {
    const { paymentType, items } = data; // items: [{ productId, supplierId, quantity, price }]

    // Group items by supplierId
    const supplierGroups = items.reduce((acc: any, item: any) => {
      if (!acc[item.supplierId]) acc[item.supplierId] = [];
      acc[item.supplierId].push(item);
      return acc;
    }, {});

    const supplierIds = Object.keys(supplierGroups);

    return this.prisma.$transaction(
      supplierIds.map((sid) =>
        this.prisma.order.create({
          data: {
            retailId,
            paymentType,
            status: 'pending',
            items: {
              create: supplierGroups[sid].map((item: any) => ({
                productId: item.productId,
                supplierId: item.supplierId,
                quantity: item.quantity,
                price: item.price,
              })),
            },
          },
          include: { items: true },
        }),
      ),
    );
  }

  async findByRetail(retailId: number) {
    const orders = await this.prisma.order.findMany({
      where: { retailId },
      include: {
        items: {
          include: {
            product: true,
            supplier: { select: { name: true, phone: true, address: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((order) => {
      const total = order.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      return { ...order, total };
    });
  }

  async findBySupplier(supplierId: number) {
    // Only return orders containing items belonging to this supplier
    const orders = await this.prisma.order.findMany({
      where: {
        items: { some: { supplierId } },
      },
      include: {
        retail: { select: { name: true, phone: true, address: true } },
        items: {
          where: { supplierId },
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return (orders as any[]).map((order) => {
      const total = (order.items as any[]).reduce(
        (sum: number, item: any) => sum + item.price * item.quantity,
        0,
      );
      return { ...order, total };
    });
  }

  async updateStatus(orderId: number, status: string) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }
}
