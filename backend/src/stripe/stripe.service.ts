import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

import { CreateStripeDto } from './dto/create-stripe.dto';
import { LoggerService } from 'src/common/logger/logger.service';

@Injectable()
export class StripeService implements OnModuleInit {
  private readonly stripe: Stripe;
  private readonly frontendUrl: string;
  private readonly webhookSecret: string;
  private readonly context = 'StripeService';

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService
  ) {
    const stripeSecretKey =
      this.configService.getOrThrow<string>(
        'STRIPE_SECRET_KEY',
      );

    this.frontendUrl =
      this.configService.getOrThrow<string>(
        'FRONTEND_URL',
      );

    this.webhookSecret =
      this.configService.getOrThrow<string>(
        'STRIPE_WEBHOOK_SECRET',
      );
    
    this.logger.debug(
      `Webhook Stripe traité avec succès : ${this.webhookSecret})`,
      this.context,
    );

    this.stripe = new Stripe(stripeSecretKey);
  }

  async onModuleInit(): Promise<void> {
    try {
      const account = await this.stripe.accounts.retrieve();
  
      this.logger.debug(
        `Compte Stripe utilisé par Nest : id=${account.id}, email=${account.email}`,
        this.context,
      );
    } catch (error) {
      this.logger.error(
        `Impossible de récupérer le compte Stripe : ${
          error instanceof Error ? error.message : String(error)
        }`,
        this.context,
      );
    }
  }

  async createCheckoutSession(
    createStripeDto: CreateStripeDto,
  ): Promise<Stripe.Checkout.Session> {
    try {
      return await this.stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],

        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: 'Inscription Tournoi Belote',
              },
              unit_amount: createStripeDto.amount * 100,
            },
            quantity: 1,
          },
        ],

        metadata: {
          userId: String(createStripeDto.userId),
          tournamentId: String(
            createStripeDto.tournamentId,
          ),
          dbPaymentId: String(
            createStripeDto.dbPaymentId,
          ),
        },

        success_url:
          `${this.frontendUrl}/paiement/success` +
          `?paymentId=${createStripeDto.dbPaymentId}`,

        cancel_url:
          `${this.frontendUrl}/paiement/cancel`,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Erreur Stripe inconnue';

      throw new InternalServerErrorException(
        `Impossible de créer la session Stripe : ${message}`,
      );
    }
  }

  constructWebhookEvent(
    rawBody: Buffer,
    signature: string,
  ): Stripe.Event {
    try {
      return this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        this.webhookSecret,
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Signature Stripe invalide';

      throw new BadRequestException(
        `Webhook Stripe invalide : ${message}`,
      );
    }
  }

  getConfigurationStatus() {
    return {
      webhookSecretConfigured:
        this.webhookSecret.length > 0,
      stripeClientConfigured: Boolean(this.stripe),
      frontendUrl: this.frontendUrl,
      webhookEndpoint: '/stripe/webhook',
      status: 'OK',
      timestamp: new Date().toISOString(),
    };
  }
}
