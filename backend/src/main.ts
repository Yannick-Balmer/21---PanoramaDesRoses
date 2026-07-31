import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import {json, type Request,type Response } from 'express';
import { AppModule } from './app.module';
import { getCorsConfig } from './common/config/cors.config';
import { getLoggerConfig } from './common/config/logger.config';
import { CsrfService } from './common/csrf/csrf.service';
import { getValidationPipe } from './common/config/validation.config';
import logMergedEnv from './common/utils/env.utils';
import { LoggerService } from './common/logger/logger.service';

const env = process.env.NODE_ENV ?? '';

type RequestWithRawBody = Request & {
  rawBody?: Buffer;
};

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: getLoggerConfig(env),
    // Désactive uniquement les parseurs automatiques de Nest.
    bodyParser: false,
  });

  const configService = app.get(ConfigService);
  const logger = app.get(LoggerService);
  const frontendOrigin =configService.getOrThrow<string>('FRONTEND_URL');
  const csrfService = app.get(CsrfService);
  const port = configService.get<number>('PORT') ?? 3000;



  if (['development', 'test'].includes(env)) {
    logMergedEnv(configService, env, logger);
  }

  app.enableCors(getCorsConfig(configService));
  app.use(cookieParser());

  /*
   * Le JSON est parsé normalement pour toutes les routes.
   *
   * Le callback verify reçoit toutefois le Buffer avant JSON.parse().
   * On ne le conserve que pour le webhook Stripe.
   */

  app.use(
    json({
      limit: '10mb',

      verify: (
        request: RequestWithRawBody,
        _response: Response,
        buffer: Buffer,
      ): void => {
        if (request.originalUrl === '/stripe/webhook') {
          request.rawBody = Buffer.from(buffer);
        }
      },
    }),
  );

  app.use(csrfService.middleware);
  app.useGlobalPipes(getValidationPipe());

  await app.listen(port, '0.0.0.0');

  logger.log(`🌐 Frontend autorisé : ${frontendOrigin}`);
}

void bootstrap();