import { PrismaService } from '../prisma/prisma.service';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any, supplierId: number): Promise<any>;
    findBySupplier(supplierId: number): Promise<any>;
    findOne(id: number): Promise<any>;
    update(id: number, supplierId: number, data: any): Promise<any>;
    delete(id: number, supplierId: number): Promise<any>;
    findAll(): Promise<any>;
    getRetailCatalog(retailId: number): Promise<any>;
}
