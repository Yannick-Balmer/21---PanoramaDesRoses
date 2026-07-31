import { Inject, Injectable } from '@nestjs/common';
import type { Request, Response, RequestHandler } from 'express';
import { CSRF_PROTECTION } from './csrf.constants';
import { doubleCsrf } from 'csrf-csrf';

export type CsrfUtilities = ReturnType<typeof doubleCsrf>;

@Injectable()
export class CsrfService {
  constructor(
    @Inject(CSRF_PROTECTION)
    private readonly csrf: CsrfUtilities,
  ) {}

  generateToken(request: Request, response: Response): string {
    return this.csrf.generateCsrfToken(request, response);
  }

  get middleware(): RequestHandler {
    return this.csrf.doubleCsrfProtection;
  }
}