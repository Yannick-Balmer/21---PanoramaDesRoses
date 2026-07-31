// src/common/guards/roles.guard.ts

import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {} 

  canActivate(context: ExecutionContext): boolean {
    // 1. Récupérer les rôles requis de la route via le décorateur @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(), // Handler (méthode)
      context.getClass(),   // Contrôleur (classe)
    ]);

    // Si aucun rôle n'est requis sur la route (pas de décorateur @Roles), l'accès est autorisé
    if (!requiredRoles) {
      return true; 
    }

    // 2. Récupérer l'utilisateur (attaché par votre AuthGuard précédent)
    const { user } = context.switchToHttp().getRequest();
    
    if (!user || !user.role) {
        // Le AuthGuard devrait déjà avoir bloqué si l'utilisateur est absent.
        // Si cet objet user est absent, l'accès est refusé.
        throw new ForbiddenException('Accès refusé : aucun rôle trouvé.');
    }

    // 3. Vérifier l'autorisation
    // On vérifie si le rôle de l'utilisateur est inclus dans le tableau des rôles requis.
    const hasRole = requiredRoles.some((role) => user.role === role);
    
    if (!hasRole) {
        throw new ForbiddenException('Accès refusé : permissions insuffisantes.');
    }
    
    return true;
  }
}