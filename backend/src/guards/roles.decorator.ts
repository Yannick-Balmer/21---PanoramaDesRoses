// src/common/decorators/roles.decorator.ts

import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

// Clé utilisée pour stocker les metadata (doit être unique)
export const ROLES_KEY = 'roles'; 

// Décorateur qui prend un tableau de Rôles
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);