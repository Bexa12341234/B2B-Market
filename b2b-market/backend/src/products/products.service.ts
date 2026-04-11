import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any, supplierId: number) {
    const { segmentIds, ...rest } = data;
    return this.prisma.product.create({
      data: {
        ...rest,
        supplierId,
        segments:
          segmentIds && segmentIds.length > 0
            ? {
                connect: segmentIds.map((id: number) => ({ id })),
              }
            : undefined,
      },
    });
  }

  async findBySupplier(supplierId: number) {
    return this.prisma.product.findMany({
      where: { supplierId },
      include: { category: true, segments: true },
    });
  }

  async findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: { segments: true },
    });
  }

  async update(id: number, supplierId: number, data: any) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product || product.supplierId !== supplierId) {
      throw new ForbiddenException('Not your product or not found');
    }
    const { segmentIds, ...rest } = data;
    return this.prisma.product.update({
      where: { id },
      data: {
        ...rest,
        segments: {
          set: segmentIds ? segmentIds.map((sid: number) => ({ id: sid })) : [],
        },
      },
    });
  }

  async delete(id: number, supplierId: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product || product.supplierId !== supplierId) {
      throw new ForbiddenException('Not your product or not found');
    }
    // Prisma will delete associations in the join table automatically
    return this.prisma.product.delete({
      where: { id },
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: {
        category: true,
        supplier: { select: { name: true } },
        segments: true,
      },
    });
  }

  async getRetailCatalog(retailId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: retailId },
      select: { segmentId: true },
    });

    return this.prisma.product.findMany({
      where: {
        OR: [
          { segments: { none: {} } },
          ...(user?.segmentId
            ? [{ segments: { some: { id: user.segmentId } } }]
            : []),
        ],
      },
      include: {
        category: true,
        supplier: { select: { name: true } },
        segments: true,
      },
    });
  }
}
