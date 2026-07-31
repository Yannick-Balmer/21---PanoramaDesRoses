import { ValidationPipe } from '@nestjs/common';

export function getValidationPipe() {
  return new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  });
}
