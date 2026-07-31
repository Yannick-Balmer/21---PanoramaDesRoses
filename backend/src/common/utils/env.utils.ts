import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import dotenv from 'dotenv';
import { LoggerService } from '../logger/logger.service';

const sensitiveWords = [
  'SECRET',
  'PASSWORD',
  'TOKEN',
  'PRIVATE',
  'DATABASE_URL',
  'API_KEY',
  'JWT_SECRET',
  'SSE_JWT_SECRET',
  'CSRF_SECRET',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
];

function maskValue(key: string, value: unknown): string {
  const isSensitive = sensitiveWords.some((word) =>
    key.toUpperCase().includes(word),
  );

  if (isSensitive) {
    return '********';
  }

  if (
    value === undefined ||
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return String(value ?? '');
  }

  return '[valeur complexe]';
}

export default function logMergedEnv(
  configService: ConfigService,
  env: string,
  logger: LoggerService,
): void {
  const files = ['env/.env', `env/.env.${env}`];

  const keys = new Set<string>();

  for (const file of files) {
    const filePath = path.join(process.cwd(), file);

    if (!fs.existsSync(filePath)) {
      logger.warn(`Fichier d'environnement introuvable : ${file}`);
      continue;
    }

    const parsed = dotenv.parse(fs.readFileSync(filePath));

    Object.keys(parsed).forEach((key) => keys.add(key));
  }

  logger.debug('📦 Configuration finale après fusion :');

  [...keys].sort().forEach((key) => {
    const value = configService.get<unknown>(key);

    logger.debug(`${key}=${maskValue(key, value)}`);
  });
}
