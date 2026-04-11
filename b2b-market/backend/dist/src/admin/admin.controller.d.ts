import { AdminService } from './admin.service';
export declare class AdminController {
    private adminService;
    constructor(adminService: AdminService);
    createUser(data: any): Promise<User>;
    getUsers(): Promise<any>;
    updateUser(id: string, data: any): Promise<any>;
    deleteUser(id: string): Promise<any>;
    createSegment(name: string): Promise<any>;
    updateSegment(id: string, name: string): Promise<any>;
    deleteSegment(id: string): Promise<any>;
    createCategory(name: string): Promise<any>;
    updateCategory(id: string, name: string): Promise<any>;
    deleteCategory(id: string): Promise<any>;
    getOrders(): Promise<any>;
}
