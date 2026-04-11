import { PrismaService } from '../prisma/prisma.service';
export declare class POSService {
    private prisma;
    constructor(prisma: PrismaService);
    createSession(retailId: number, items: any[]): Promise<any>;
    getSessions(retailId: number): Promise<any>;
    deleteSession(id: number): Promise<any>;
    getMyStock(retailId: number): Promise<any[]>;
}
