import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

describe('PaymentsController', () => {
  let controller: PaymentsController;
  let paymentsService: jest.Mocked<PaymentsService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        {
          provide: PaymentsService,
          useValue: {
            initializePayment: jest.fn(),
            getPaymentForUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
    paymentsService = module.get(PaymentsService);
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getSseToken', () => {
    it('should return a signed token when payment belongs to user', async () => {
      paymentsService.getPaymentForUser.mockResolvedValueOnce({} as any);
      jwtService.sign.mockReturnValueOnce('signed-token');

      const req: any = { user: { id: 42 } };
      const result = await controller.getSseToken(req, { paymentId: '7' });

      expect(paymentsService.getPaymentForUser).toHaveBeenCalledWith(7, 42);
      expect(jwtService.sign).toHaveBeenCalledWith(
        { sub: 42, paymentId: '7' },
        { expiresIn: '10m', secret: process.env.SSE_JWT_SECRET },
      );
      expect(result).toEqual({ token: 'signed-token' });
    });

    it('should throw UnauthorizedException when user is missing', async () => {
      await expect(controller.getSseToken({} as any, { paymentId: '1' })).rejects.toThrow(
        UnauthorizedException,
      );
      expect(paymentsService.getPaymentForUser).not.toHaveBeenCalled();
      expect(jwtService.sign).not.toHaveBeenCalled();
    });
  });
});
