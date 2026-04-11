import { ProductsService } from './products.service';
export declare class ProductsController {
    private productsService;
    constructor(productsService: ProductsService);
    create(req: any, body: any): Promise<any>;
    findMy(req: any): Promise<any>;
    getCatalog(req: any): Promise<any>;
    update(id: string, req: any, body: any): Promise<any>;
    delete(id: string, req: any): Promise<any>;
    findAll(): Promise<any>;
}
