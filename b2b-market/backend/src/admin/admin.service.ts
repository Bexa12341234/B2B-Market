import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async createUser(data: Prisma.UserCreateInput) {
    return this.usersService.create(data);
  }

  async getAllUsers() {
    return this.usersService.findAll();
  }

  async updateUser(id: number, data: any) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async createSegment(name: string) {
    return this.prisma.segment.create({
      data: { name },
    });
  }

  async updateSegment(id: number, data: { name: string }) {
    return this.prisma.segment.update({
      where: { id },
      data,
    });
  }

  async createCategory(name: string) {
    return this.prisma.category.create({
      data: { name },
    });
  }

  async updateCategory(id: number, data: { name: string }) {
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: number) {
    try {
      // 1. Delete products if user is a supplier
      await this.prisma.product.deleteMany({ where: { supplierId: id } });
      
      // 2. Delete orders if user is a retail
      // We also need to delete order items first
      const orders = await this.prisma.order.findMany({ where: { retailId: id } });
      for (const order of orders) {
        await this.prisma.orderItem.deleteMany({ where: { orderId: order.id } });
      }
      await this.prisma.order.deleteMany({ where: { retailId: id } });

      // 3. Handle POS sessions
      const posSessions = await this.prisma.pOSSession.findMany({ where: { retailId: id } });
      for (const session of posSessions) {
        await this.prisma.pOSItem.deleteMany({ where: { sessionId: session.id } });
      }
      await this.prisma.pOSSession.deleteMany({ where: { retailId: id } });

      return await this.prisma.user.delete({ where: { id } });
    } catch (e) {
      console.error(e);
      throw new BadRequestException("Ushbu foydalanuvchini o'chirishda xatolik yuz berdi.");
    }
  }

  async deleteSegment(id: number) {
    try {
      // Disconnect users
      await this.prisma.user.updateMany({
        where: { segmentId: id },
        data: { segmentId: null }
      });
      // Implicit many-to-many products relation is handled by Prisma
      return await this.prisma.segment.delete({ where: { id } });
    } catch (e) {
      console.error(e);
      throw new BadRequestException("Ushbu segmentni o'chirishda xatolik yuz berdi.");
    }
  }

  async deleteCategory(id: number) {
    try {
      // If we delete a category, products must be handled.
      // To "make it work", we will delete products in this category.
      await this.prisma.product.deleteMany({ where: { categoryId: id } });
      
      return await this.prisma.category.delete({ where: { id } });
    } catch (e) {
      console.error(e);
      throw new BadRequestException("Ushbu kategoriyani o'chirishda xatolik yuz berdi.");
    }
  }

  async getAllOrders() {
    return this.prisma.order.findMany({
      include: {
        retail: { select: { name: true, phone: true, address: true } },
        items: {
          include: { product: true, supplier: { select: { name: true, phone: true, address: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
