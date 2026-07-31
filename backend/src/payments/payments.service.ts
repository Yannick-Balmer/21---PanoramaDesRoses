import { ForbiddenException, Injectable, InternalServerErrorException} from '@nestjs/common';
import Stripe from 'stripe';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { StripeService } from 'src/stripe/stripe.service';
import { LoggerService } from '../common/logger/logger.service';
import { PaymentEventsService } from './payments.events';

@Injectable()
export class PaymentsService {
    private readonly context = 'PaymentsService';

    constructor(
      private readonly stripeService: StripeService,
      private readonly prisma: PrismaService,
      private readonly logger: LoggerService,
      private readonly paymentEvents: PaymentEventsService,
    ) {}

    async initializePayment(createPaymentDto: CreatePaymentDto): Promise<{dbPaymentId: number, url: string }> {
        const pendingPayment = await this.create(createPaymentDto);
       
          const session = await this.stripeService.createCheckoutSession({
            ...createPaymentDto,
            dbPaymentId: pendingPayment.id,
        });
        if (!session?.id || !session.url) {
          throw new InternalServerErrorException(
            'Impossible de créer la session Stripe',
          );
        }
        await this.attachStripeSession(pendingPayment.id,session.id )
        
        return {
          dbPaymentId:pendingPayment.id,
          url: session.url
        }  
  }

  async create(createPaymentDto: CreatePaymentDto)  {
    return this.prisma.payment.create({
      data: {
        userId: createPaymentDto.userId,
        tournamentId: createPaymentDto.tournamentId, 
        amount: createPaymentDto.amount,
      },
    });
  }

  async attachStripeSession(paymentId: number, sessionId: string) {
    return this.prisma.payment.update({
      where: { id: paymentId },
      data: { stripeId: sessionId },
    });
  }

  async handleStripeCheckoutSucceeded(
    session: Stripe.Checkout.Session,
  ): Promise<void> {
    this.logger.debug(
      `Traitement du succès Stripe ${session.id}`,
      this.context,
    );

    if (session.payment_status !== 'paid') {
      this.logger.warn(
        `Session ${session.id} complétée mais non payée : ${session.payment_status}`,
        this.context,
      );

      return;
    }

    const paymentId =
      this.extractPaymentIdFromSession(session);

    const payment =
      await this.prisma.payment.update({
        where: {
          id: paymentId,
        },
        data: {
          status: 'PAID',
        },
      });

    this.paymentEvents.emit(
      payment.id,
      'PAID',
    );

    this.logger.debug(
      `Événement PAID émis pour le paiement ${payment.id}`,
      this.context,
    );
  }

  async handleStripeCheckoutFailed(
    session: Stripe.Checkout.Session,
  ): Promise<void> {
    this.logger.debug(
      `Traitement de l'échec Stripe ${session.id}`,
      this.context,
    );

    const paymentId =
      this.extractPaymentIdFromSession(session);

    const payment =
      await this.prisma.payment.update({
        where: {
          id: paymentId,
        },
        data: {
          status: 'FAILED',
        },
      });

    this.paymentEvents.emit(
      payment.id,
      'FAILED',
    );

    this.logger.debug(
      `Événement FAILED émis pour le paiement ${payment.id}`,
      this.context,
    );
  }

  private extractPaymentIdFromSession(
    session: Stripe.Checkout.Session,
  ): number {
    const rawPaymentId =
      session.metadata?.dbPaymentId;

    if (!rawPaymentId) {
      throw new InternalServerErrorException(
        `dbPaymentId absent pour la session Stripe ${session.id}`,
      );
    }

    const paymentId = Number(rawPaymentId);

    if (
      !Number.isInteger(paymentId) ||
      paymentId <= 0
    ) {
      throw new InternalServerErrorException(
        `dbPaymentId invalide : ${rawPaymentId}`,
      );
    }

    return paymentId;
  }

  async getPaymentForUser(paymentId: number, userId: number){
    const payment = await this.prisma.payment.findUnique({ where: { id: paymentId }});
    if (!payment || payment.userId !== userId) {
      throw new ForbiddenException('Accès interdit à ce paiement.');
    }
    return payment;
  }

  findAll() {
    return this.prisma.payment.findMany();
  }

  findOne(id: number) {
    return this.prisma.payment.findUnique({ where: { id: id }});
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return this.prisma.payment.update({
      where: { id: id },
      data: updatePaymentDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
