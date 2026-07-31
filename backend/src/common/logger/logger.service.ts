import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService {
  private readonly loggers = new Map<string, Logger>();

  private readonly isDevelopment = process.env.NODE_ENV !== 'production';

  private getLogger(context = 'Application'): Logger {
    const existingLogger = this.loggers.get(context);

    if (existingLogger) {
      return existingLogger;
    }

    const logger = new Logger(context);

    this.loggers.set(context, logger);

    return logger;
  }

  log(message: string, context?: string): void {
    this.getLogger(context).log(message);
  }

  warn(message: string, context?: string): void {
    this.getLogger(context).warn(message);
  }

  error(message: string, trace?: string, context?: string): void {
    this.getLogger(context).error(message, trace);
  }

  debug(message: string, context?: string): void {
    if (!this.isDevelopment) {
      return;
    }

    this.getLogger(context).debug(message);
  }

  verbose(message: string, context?: string): void {
    if (!this.isDevelopment) {
      return;
    }

    this.getLogger(context).verbose(message);
  }
}
