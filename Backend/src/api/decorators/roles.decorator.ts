import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
/** Restrict a route to users with specific roles (e.g. 'admin'). */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
