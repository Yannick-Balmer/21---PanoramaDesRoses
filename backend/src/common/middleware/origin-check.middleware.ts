import {
  ForbiddenException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Request,
  Response,
  NextFunction,
} from 'express';

@Injectable()
export class OriginCheckMiddleware
  implements NestMiddleware
{
  private readonly allowedOrigins: string[];

  constructor(
    private readonly config: ConfigService,
  ) {
    this.allowedOrigins = this.config
      .getOrThrow<string>('FRONTEND_ORIGIN_CORS')
      .split(',')
      .map(origin => origin.trim())
      .filter(Boolean);
  }

  use(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const publicPaths = [
      '/auth/login',
      '/auth/register',
    ];

    if (
      publicPaths.some(path =>
        req.path.startsWith(path),
      )
    ) {
      return next();
    }

    const origin = req.get('origin');
    const referer = req.get('referer');

    // Origin : comparaison exacte
    if (
      origin &&
      this.allowedOrigins.includes(origin)
    ) {
      return next();
    }

    // Referer : extraction de son origin
    if (referer) {
      try {
        const refererOrigin =
          new URL(referer).origin;

        if (
          this.allowedOrigins.includes(
            refererOrigin,
          )
        ) {
          return next();
        }
      } catch {
        // Referer invalide → on continue vers le rejet
      }
    }

    if (req.method === 'GET') {
      return next();
    }

    throw new ForbiddenException(
      'Invalid request origin',
    );
  }
}