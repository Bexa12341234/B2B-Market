import { PrismaService } from '../prisma/prisma.service';
export declare class SegmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<any>;
}
