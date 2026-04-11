export type Role = 'ADMIN' | 'SUPPLIER' | 'RETAIL';
export declare const Role: {
    ADMIN: "ADMIN";
    SUPPLIER: "SUPPLIER";
    RETAIL: "RETAIL";
};
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: Role[]) => import("@nestjs/common").CustomDecorator<string>;
