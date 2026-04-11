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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let OrdersService = class OrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createOrder(retailId, data) {
        const { paymentType, items } = data;
        const supplierGroups = items.reduce((acc, item) => {
            if (!acc[item.supplierId])
                acc[item.supplierId] = [];
            acc[item.supplierId].push(item);
            return acc;
        }, {});
        const supplierIds = Object.keys(supplierGroups);
        return this.prisma.$transaction(supplierIds.map((sid) => this.prisma.order.create({
            data: {
                retailId,
                paymentType,
                status: 'pending',
                items: {
                    create: supplierGroups[sid].map((item) => ({
                        productId: item.productId,
                        supplierId: item.supplierId,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                },
            },
            include: { items: true },
        })));
    }
    async findByRetail(retailId) {
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
            const total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
            return { ...order, total };
        });
    }
    async findBySupplier(supplierId) {
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
        return orders.map((order) => {
            const total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
            return { ...order, total };
        });
    }
    async updateStatus(orderId, status) {
        return this.prisma.order.update({
            where: { id: orderId },
            data: { status },
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map