import { OrdersService } from './orders.service';
export declare class OrdersController {
    private ordersService;
    constructor(ordersService: OrdersService);
    create(req: any, body: any): Promise<any>;
    findRetail(req: any): Promise<any>;
    findSupplier(req: any): Promise<any[]>;
    updateStatus(id: string, body: {
        status: string;
    }): Promise<any>;
}
