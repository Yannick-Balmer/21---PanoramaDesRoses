import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { json } from 'express';
import { AppModule } from './app.module';
import { getCorsConfig } from './common/config/cors.config';
import { getLoggerConfig } from './common/config/logger.config';
import { CsrfService } from './common/csrf/csrf.service';
import { getValidationPipe } from './common/config/validation.config';
import logMergedEnv from './common/utils/env.utils';
import { LoggerService } from './common/logger/logger.service';

const env = process.env.NODE_ENV ?? '';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: getLoggerConfig(env),
    bodyParser: false,
  });

  const configService = app.get(ConfigService);
  const logger = app.get(LoggerService);
  const frontendOrigin = configService.getOrThrow<string>('FRONTEND_URL');
  const csrfService = app.get(CsrfService);
  const port = configService.get<number>('PORT') ?? 3000;

  if (['development', 'test'].includes(env)) {
    logMergedEnv(configService, env, logger);
  }

  app.enableCors(getCorsConfig(configService));
  app.use(cookieParser());

  app.use(json({ limit: '1mb' }));

  app.use(csrfService.middleware);
  app.useGlobalPipes(getValidationPipe());

  await app.listen(port, '0.0.0.0');

  logger.log(`🌐 Frontend autorisé : ${frontendOrigin}`);
}

void bootstrap();
