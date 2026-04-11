import { PrismaService } from '../prisma/prisma.service';
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    createOrder(retailId: number, data: any): Promise<any>;
    findByRetail(retailId: number): Promise<any>;
    findBySupplier(supplierId: number): Promise<any[]>;
    updateStatus(orderId: number, status: string): Promise<any>;
}
