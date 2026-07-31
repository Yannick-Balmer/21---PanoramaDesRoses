import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { doubleCsrf } from 'csrf-csrf';
import type { Request } from 'express';

import { CSRF_PROTECTION } from './csrf.constants';
import { CsrfController } from './csrf.controller';
import {
  CsrfService,
  type CsrfUtilities,
} from './csrf.service';

@Module({
  controllers: [CsrfController],
  providers: [
    {
      provide: CSRF_PROTECTION,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): CsrfUtilities => {
        const environment =
          configService.get<string>('NODE_ENV') ?? 'development';

        const csrfSecret =
          configService.getOrThrow<string>('CSRF_SECRET');

        return doubleCsrf({
          getSecret: () => csrfSecret,

          getSessionIdentifier: (request: Request): string => {
            return request.cookies?.access_token ?? 'anonymous';
          },

          cookieName: 'csrf-token',

          cookieOptions: {
            httpOnly: true,
            secure: environment === 'production',
            sameSite: 'lax',
            path: '/',
          },

          ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],

          getCsrfTokenFromRequest: (request: Request) => {
            const token = request.headers['x-csrf-token'];

            return Array.isArray(token) ? token[0] : token;
          },

          skipCsrfProtection: (request: Request) => {
            return request.originalUrl.startsWith('/stripe/webhook');
          },
        });
      },
    },
    CsrfService,
  ],
  exports: [CsrfService],
})
export class CsrfModule {}