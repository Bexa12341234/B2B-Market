import { SetMetadata } from '@nestjs/common';

export type Role = 'ADMIN' | 'SUPPLIER' | 'RETAIL';

export const Role = {
  ADMIN: 'ADMIN' as const,
  SUPPLIER: 'SUPPLIER' as const,
  RETAIL: 'RETAIL' as const,
};

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
