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
exports.POSService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let POSService = class POSService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createSession(retailId, items) {
        return this.prisma.pOSSession.create({
            data: {
                retailId,
                items: {
                    create: items.map((item) => ({
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
    async getSessions(retailId) {
        return this.prisma.pOSSession.findMany({
            where: { retailId },
            include: { items: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async deleteSession(id) {
        await this.prisma.pOSItem.deleteMany({ where: { sessionId: id } });
        return this.prisma.pOSSession.delete({
            where: { id },
        });
    }
    async getMyStock(retailId) {
        const orderItems = await this.prisma.orderItem.findMany({
            where: {
                order: {
                    retailId: retailId,
                    status: 'confirmed',
                }
            },
            include: {
                product: {
                    include: { category: true }
                }
            }
        });
        const soldItems = await this.prisma.pOSItem.findMany({
            where: {
                session: { retailId }
            }
        });
        const stockMap = new Map();
        orderItems.forEach(item => {
            const p = item.product;
            if (!p)
                return;
            if (!stockMap.has(p.id)) {
                stockMap.set(p.id, {
                    ...p,
                    purchasedPrice: item.price,
                    totalPurchasedQuantity: 0,
                    totalSoldQuantity: 0,
                    currentStock: 0
                });
            }
            stockMap.get(p.id).totalPurchasedQuantity += item.quantity;
        });
        soldItems.forEach(item => {
            if (item.productId && stockMap.has(item.productId)) {
                stockMap.get(item.productId).totalSoldQuantity += item.quantity;
            }
        });
        const results = Array.from(stockMap.values()).map(p => ({
            ...p,
            currentStock: p.totalPurchasedQuantity - p.totalSoldQuantity,
            purchasedPrice: p.purchasedPrice
        }));
        return results;
    }
};
exports.POSService = POSService;
exports.POSService = POSService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], POSService);
//# sourceMappingURL=pos.service.js.map