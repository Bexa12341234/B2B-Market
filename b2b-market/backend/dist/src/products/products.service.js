"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProductsService = class ProductsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data, supplierId) {
        const { segmentIds, ...rest } = data;
        return this.prisma.product.create({
            data: {
                ...rest,
                supplierId,
                segments: segmentIds && segmentIds.length > 0
                    ? {
                        connect: segmentIds.map((id) => ({ id })),
                    }
                    : undefined,
            },
        });
    }
    async findBySupplier(supplierId) {
        return this.prisma.product.findMany({
            where: { supplierId },
            include: { category: true, segments: true },
        });
    }
    async findOne(id) {
        return this.prisma.product.findUnique({
            where: { id },
            include: { segments: true },
        });
    }
    async update(id, supplierId, data) {
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product || product.supplierId !== supplierId) {
            throw new common_1.ForbiddenException('Not your product or not found');
        }
        const { segmentIds, ...rest } = data;
        return this.prisma.product.update({
            where: { id },
            data: {
                ...rest,
                segments: {
                    set: segmentIds ? segmentIds.map((sid) => ({ id: sid })) : [],
                },
            },
        });
    }
    async delete(id, supplierId) {
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product || product.supplierId !== supplierId) {
            throw new common_1.ForbiddenException('Not your product or not found');
        }
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
    async getRetailCatalog(retailId) {
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
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map