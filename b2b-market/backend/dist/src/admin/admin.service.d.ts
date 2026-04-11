import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { Prisma } from '@prisma/client';
export declare class AdminService {
    private prisma;
    private usersService;
    constructor(prisma: PrismaService, usersService: UsersService);
    createUser(data: Prisma.UserCreateInput): Promise<User>;
    getAllUsers(): Promise<any>;
    updateUser(id: number, data: any): Promise<any>;
    createSegment(name: string): Promise<any>;
    updateSegment(id: number, data: {
        name: string;
    }): Promise<any>;
    createCategory(name: string): Promise<any>;
    updateCategory(id: number, data: {
        name: string;
    }): Promise<any>;
    deleteUser(id: number): Promise<any>;
    deleteSegment(id: number): Promise<any>;
    deleteCategory(id: number): Promise<any>;
    getAllOrders(): Promise<any>;
}
