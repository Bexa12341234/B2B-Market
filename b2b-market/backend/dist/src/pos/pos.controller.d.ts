import { POSService } from './pos.service';
export declare class POSController {
    private posService;
    constructor(posService: POSService);
    createSession(req: any, items: any[]): Promise<any>;
    getStock(req: any): Promise<any[]>;
    getSessions(req: any): Promise<any>;
    deleteSession(id: string): Promise<any>;
}
