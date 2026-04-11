import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findOne(phone: string): Promise<User | null>;
    findById(id: number): Promise<User | null>;
    create(data: Prisma.UserCreateInput): Promise<User>;
    findAll(): Promise<any>;
}
