import { ConfigService } from '@nestjs/config';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export function getCorsConfig(
  configService: ConfigService,
): CorsOptions {
    const allowedOrigins = configService
  .getOrThrow<string>('FRONTEND_ORIGIN_CORS')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

  return {

    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin CORS interdite: ${origin}`), false);
      }
    },
    
    methods: [
      'GET',
      'POST',
      'PUT',
      'DELETE',
      'PATCH',
      'OPTIONS',
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'x-csrf-token',
      'X-CSRF-TOKEN',
    ],

    exposedHeaders: [
      'x-csrf-token', 
      'X-CSRF-TOKEN'
    ],

    credentials: true,
  };
}
