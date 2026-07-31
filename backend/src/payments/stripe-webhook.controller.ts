import {
    BadRequestException,
    Controller,
    Headers,
    HttpCode,
    Post,
    Req,
  } from '@nestjs/common';
  import type { RawBodyRequest } from '@nestjs/common';
  import type { Request } from 'express';
  import Stripe from 'stripe';
  
  import { LoggerService } from '../common/logger/logger.service';
  import { StripeService } from '../stripe/stripe.service';
  import { PaymentsService } from './payments.service';
  
  @Controller('stripe')
  export class StripeWebhookController {
    private readonly context = 'StripeWebhook';
  
    constructor(
      private readonly stripeService: StripeService,
      private readonly paymentsService: PaymentsService,
      private readonly logger: LoggerService,
    ) {}
  
    @Post('webhook')
    @HttpCode(200)
    async handleStripeWebhook(
      @Req() request: RawBodyRequest<Request>,
      @Headers('stripe-signature') signature?: string,
    ): Promise<{ received: true }> {
        this.logger.debug(
            `WEBHOOK APPELÉ : ${request.method} ${request.originalUrl}`,
            this.context,
          );
       
        this.logger.debug(
            `Webhook Stripe reçu sur ${request.originalUrl}`,
            this.context,
        );
        
        this.logger.debug(
            `Content-Type: ${request.headers['content-type']}`,
            this.context,
        );
        
        this.logger.debug(
            `Stripe-Signature présente: ${Boolean(signature)}`,
            this.context,
          );
        
        this.logger.debug(
            `Raw body présent: ${Boolean(request.rawBody)}`,
            this.context,
        );
        
        this.logger.debug(
            `Raw body taille: ${request.rawBody?.length ?? 0} octets`,
            this.context,
        );
        
        if (!signature) {
            this.logger.warn(
              'En-tête Stripe-Signature manquant',
              this.context,
            );
  
            throw new BadRequestException(
            'En-tête Stripe-Signature manquant',
            );
        }
  
        if (!Buffer.isBuffer(request.rawBody)) {
            this.logger.error(
              `Raw body invalide : type=${typeof request.rawBody}`,
              undefined,
              this.context,
            );
          
            throw new BadRequestException(
              'Le corps brut du webhook Stripe est indisponible',
            );
          }

          this.logger.debug(
            `Raw body Buffer: ${Buffer.isBuffer(request.rawBody)}`,
            this.context,
          );
          
          this.logger.debug(
            `Raw body taille: ${request.rawBody.byteLength} octets`,
            this.context,
          );
  
        let event: Stripe.Event;

        try {
            event = this.stripeService.constructWebhookEvent(
            request.rawBody,
            signature,
            );
        } catch (error) {
            this.logger.error(
            `Échec de vérification du webhook Stripe: ${
                error instanceof Error ? error.message : String(error)
            }`,
            this.context,
            );

            throw new BadRequestException(
            'Signature du webhook Stripe invalide',
            );
        }
  
      this.logger.debug(
        `Événement vérifié : ${event.type} (${event.id})`,
        this.context,
      );
  
      try {
        await this.processStripeEvent(event);
      } catch (error) {
        this.logger.error(
          `Erreur pendant le traitement de ${event.type} (${event.id}): ${
            error instanceof Error ? error.message : String(error)
          }`,
          this.context,
        );
    
        throw error;
      }
    
      this.logger.debug(
        `Webhook Stripe traité avec succès : ${event.type} (${event.id})`,
        this.context,
      );
  
      return {
        received: true,
      };
    }

    private async processStripeEvent(
        event: Stripe.Event,
      ): Promise<void> {
        this.logger.debug(
          `Début traitement événement Stripe : ${event.type}`,
          this.context,
        );
      
        switch (event.type) {
          case 'checkout.session.completed':
          case 'checkout.session.async_payment_succeeded': {
            const session =
              event.data.object as Stripe.Checkout.Session;
      
            this.logger.debug(
              `Session de paiement réussie détectée : ${session.id}, payment_status=${session.payment_status}`,
              this.context,
            );
      
            await this.paymentsService
              .handleStripeCheckoutSucceeded(session);
      
            break;
          }
      
          case 'checkout.session.expired':
          case 'checkout.session.async_payment_failed': {
            const session =
              event.data.object as Stripe.Checkout.Session;
      
            this.logger.debug(
              `Session de paiement échouée/expirée détectée : ${session.id}`,
              this.context,
            );
      
            await this.paymentsService
              .handleStripeCheckoutFailed(session);
      
            break;
          }
      
          default:
            this.logger.debug(
              `Événement ignoré : ${event.type}`,
              this.context,
            );
        }
      }
    
     
  
  
  }