import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly secret: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.secret = this.configService.get<string>('JWT_SECRET') ?? '';
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromCookie(request);

    if (!token) {
      throw new UnauthorizedException('Token manquant');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.secret,
      });

      request.user = {
        id: payload.sub,
        role: payload.role,
        email: payload.email,
      };
    } catch {
      throw new UnauthorizedException('Token invalide');
    }

    return true;
  }

  private extractTokenFromCookie(request: Request): string | undefined {
      return request.cookies?.access_token;
  }
  
}
