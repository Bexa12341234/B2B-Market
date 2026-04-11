import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(body: any): Promise<{
        access_token: string;
        user: {
            id: any;
            phone: any;
            name: any;
            role: any;
            segmentId: any;
        };
    }>;
    getProfile(req: any): any;
}
