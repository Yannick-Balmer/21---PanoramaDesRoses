import { AuthGuard } from '../guards/auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('AuthGuard', () => {
  it('should be defined', () => {
    const jwtService = { verifyAsync: jest.fn() } as unknown as JwtService;
    expect(new AuthGuard(jwtService)).toBeDefined();
  });
});
