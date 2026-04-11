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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const users_service_1 = require("../users/users.service");
let AdminService = class AdminService {
    prisma;
    usersService;
    constructor(prisma, usersService) {
        this.prisma = prisma;
        this.usersService = usersService;
    }
    async createUser(data) {
        return this.usersService.create(data);
    }
    async getAllUsers() {
        return this.usersService.findAll();
    }
    async updateUser(id, data) {
        return this.prisma.user.update({
            where: { id },
            data,
        });
    }
    async createSegment(name) {
        return this.prisma.segment.create({
            data: { name },
        });
    }
    async updateSegment(id, data) {
        return this.prisma.segment.update({
            where: { id },
            data,
        });
    }
    async createCategory(name) {
        return this.prisma.category.create({
            data: { name },
        });
    }
    async updateCategory(id, data) {
        return this.prisma.category.update({
            where: { id },
            data,
        });
    }
    async deleteUser(id) {
        try {
            await this.prisma.product.deleteMany({ where: { supplierId: id } });
            const orders = await this.prisma.order.findMany({ where: { retailId: id } });
            for (const order of orders) {
                await this.prisma.orderItem.deleteMany({ where: { orderId: order.id } });
            }
            await this.prisma.order.deleteMany({ where: { retailId: id } });
            const posSessions = await this.prisma.pOSSession.findMany({ where: { retailId: id } });
            for (const session of posSessions) {
                await this.prisma.pOSItem.deleteMany({ where: { sessionId: session.id } });
            }
            await this.prisma.pOSSession.deleteMany({ where: { retailId: id } });
            return await this.prisma.user.delete({ where: { id } });
        }
        catch (e) {
            console.error(e);
            throw new common_1.BadRequestException("Ushbu foydalanuvchini o'chirishda xatolik yuz berdi.");
        }
    }
    async deleteSegment(id) {
        try {
            await this.prisma.user.updateMany({
                where: { segmentId: id },
                data: { segmentId: null }
            });
            return await this.prisma.segment.delete({ where: { id } });
        }
        catch (e) {
            console.error(e);
            throw new common_1.BadRequestException("Ushbu segmentni o'chirishda xatolik yuz berdi.");
        }
    }
    async deleteCategory(id) {
        try {
            await this.prisma.product.deleteMany({ where: { categoryId: id } });
            return await this.prisma.category.delete({ where: { id } });
        }
        catch (e) {
            console.error(e);
            throw new common_1.BadRequestException("Ushbu kategoriyani o'chirishda xatolik yuz berdi.");
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
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        users_service_1.UsersService])
], AdminService);
//# sourceMappingURL=admin.service.js.map