import type { LogLevel } from '@nestjs/common';

export function getLoggerConfig(env: string): LogLevel[] {
  return env === 'production'
    ? ['error', 'warn']
    : ['log', 'error', 'warn', 'debug', 'verbose'];
}