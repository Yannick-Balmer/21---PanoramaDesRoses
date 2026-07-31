import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Sse,
  UnauthorizedException,
  UseGuards,
  MessageEvent as NestMessageEvent,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Observable } from 'rxjs';
import { PaymentEventsService } from './payments.events';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/guards/roles.decorator';
import { CreateSseTokenDto } from './dto/create-sse-token.dto';
import { LoggerService } from 'src/common/logger/logger.service';

type AuthenticatedRequest = Request & { user?: { id: number } };
type SseTokenResponse = {
  token: string;
};
type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "CANCELED";

type PaymentSsePayload = {
  sub: number;
  paymentId: number;
  purpose: "payment-sse";
};

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly jwtService: JwtService,
    private readonly logger: LoggerService,
    private readonly paymentEvents: PaymentEventsService,
  ) {}
  private readonly context = 'PaymentSse';

  @Post('initialize')
  async initializePayment(@Body() createPaymentDto: CreatePaymentDto): Promise<{dbPaymentId:number, url: string }> {
     return await this.paymentsService.initializePayment(createPaymentDto);
    }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('USER', 'ORGANIZER', 'ADMIN')
  @Post('sse-token')
  async getSseToken(@Req() req: AuthenticatedRequest, @Body() body:CreateSseTokenDto):Promise<SseTokenResponse> {
    const userId = req.user?.id;
    console.log("🔐 USER demandant token SSE:", userId);
    console.log("💳 PAYMENT ID demandé:", body.paymentId);

    if (!userId) {
      throw new UnauthorizedException('Utilisateur non authentifié');
    }

    // Vérifier que ce paiement appartient bien à l'utilisateur
    const payment = await this.paymentsService.getPaymentForUser(body.paymentId, userId);
    console.log("✅ Paiement trouvé, statut actuel:", payment.status);

    const token = this.jwtService.sign(
      {
        sub: userId,
        paymentId: body.paymentId,
        purpose: 'payment-sse'
      },
      {
        expiresIn: '5m',
        secret: process.env.SSE_JWT_SECRET,
      },
    );

    console.log("🎫 Token SSE généré pour paymentId:", body.paymentId);
    return { token };
  }

  @Sse('events')
  events(
    @Query('token') token: string,
  ): Observable<NestMessageEvent> {
    const context = 'PaymentSse';
  
    this.logger.debug(
      '🌐 Nouvelle connexion SSE',
      context,
    );
  
    if (!token) {
      this.logger.warn(
        '❌ Aucun token SSE fourni',
        context,
      );
  
      throw new UnauthorizedException(
        'Token SSE manquant',
      );
    }
  
    this.logger.debug(
      '🔑 Vérification du token SSE',
      context,
    );
  
    let payload: PaymentSsePayload;
  
    try {
      payload =
        this.jwtService.verify<PaymentSsePayload>(
          token,
          {
            secret: process.env.SSE_JWT_SECRET,
          },
        );
  
      this.logger.debug(
        `✅ Token valide (user=${payload.sub}, payment=${payload.paymentId})`,
        context,
      );
    } catch (error: unknown) {
      this.logger.error(
        '❌ Token SSE invalide',
        error instanceof Error
          ? error.stack
          : undefined,
        context,
      );
  
      throw new UnauthorizedException(
        'Token SSE invalide',
      );
    }
  
    if (payload.purpose !== 'payment-sse') {
      this.logger.warn(
        `❌ Purpose invalide : ${payload.purpose}`,
        context,
      );
  
      throw new UnauthorizedException(
        'Token SSE invalide',
      );
    }
  
    const paymentId = payload.paymentId;
  
    this.logger.debug(
      `📡 Ouverture du flux SSE pour le paiement ${paymentId}`,
      context,
    );
  
    return new Observable<NestMessageEvent>(
      subscriber => {
        this.logger.debug(
          '🔍 Vérification du statut actuel du paiement',
          context,
        );
  
        void this.paymentsService
          .findOne(paymentId)
          .then(payment => {
            if (!payment) {
              this.logger.warn(
                `⚠️ Paiement ${paymentId} introuvable`,
                context,
              );
  
              return;
            }
  
            this.logger.debug(
              `📊 Statut actuel : ${payment.status}`,
              context,
            );
  
            if (
              payment.status === 'PAID' ||
              payment.status === 'FAILED' ||
              payment.status === 'CANCELED'
            ) {
              this.logger.debug(
                `⚡ Paiement déjà terminé (${payment.status}), envoi immédiat`,
                context,
              );
  
              subscriber.next({
                data: {
                  status: payment.status,
                },
              });
  
              subscriber.complete();
  
              return;
            }
  
            this.logger.debug(
              '⏳ Paiement en attente, écoute des événements',
              context,
            );
          })
          .catch(error => {
            this.logger.error(
              `❌ Erreur lors de la lecture du paiement ${paymentId}`,
              error instanceof Error
                ? error.stack
                : undefined,
              context,
            );
          });
  
        const handler = (
          status: PaymentStatus,
        ): void => {
          this.logger.debug(
            `📨 Événement reçu : ${status}`,
            context,
          );
  
          subscriber.next({
            data: {
              status,
            },
          });
  
          this.logger.debug(
            `📤 Événement envoyé au client : ${status}`,
            context,
          );
  
          if (
            status === 'PAID' ||
            status === 'FAILED' ||
            status === 'CANCELED'
          ) {
            this.logger.debug(
              `🔒 Statut final (${status}), fermeture du flux`,
              context,
            );
  
            subscriber.complete();
          }
        };
  
        this.logger.debug(
          `👂 Enregistrement du listener : ${paymentId}`,
          context,
        );
  
        this.paymentEvents.on(
          paymentId,
          handler,
        );
  
        return () => {
          this.logger.debug(
            `🧹 Suppression du listener : ${paymentId}`,
            context,
          );
  
          this.paymentEvents.off(
            paymentId,
            handler,
          );
        };
      },
    );
  }
 
  // @Sse('events')
  // events(@Query('token') token: string): Observable<any> {
  //   if (!token) {
  //     throw new Error('Missing token');
  //   }

  //   let payload: any;
  //   try {
  //     payload = this.jwtService.verify(token, {
  //       secret: process.env.SSE_JWT_SECRET,
  //     });
  //     if (payload.purpose !== 'payment-sse') {
  //       throw new UnauthorizedException(
  //         'Token SSE invalide',
  //       );
  //     }
  //   } catch (err) {
  //     console.error('❌ Token SSE invalide:', err);
  //     throw new Error('Invalid token');
  //   }

  //   //const paymentId = String(payload.paymentId); // S'assurer que c'est une string
  //   const paymentId = payload.paymentId; // S'assurer que c'est une string
   
  //   console.log("👂 Abonnement SSE pour paymentId:", paymentId);

  //   return new Observable(subscriber => {
  //     // ✅ IMPORTANT: Vérifier le statut actuel AVANT de s'abonner
  //     // Si le paiement est déjà payé, envoyer immédiatement l'événement
  //    // this.paymentsService.findOne(Number(paymentId))
  //     this.paymentsService.findOne(paymentId)
  //       .then(payment => {
  //         if (payment) {
  //           console.log("📊 Statut actuel du paiement:", payment.status);
  //           // Si le paiement est déjà PAID, envoyer PAID immédiatement
  //           if (payment.status === 'PAID') {
  //             console.log("✅ Paiement déjà payé, envoi immédiat de l'événement");
  //             subscriber.next({ data: { status: 'PAID' } });
  //             subscriber.complete();
  //             return;
  //           }
  //           // Si le paiement est déjà FAILED, envoyer FAILED immédiatement
  //           if (payment.status === 'FAILED') {
  //             console.log("❌ Paiement déjà échoué, envoi immédiat de l'événement");
  //             subscriber.next({ data: { status: 'FAILED' } });
  //             subscriber.complete();
  //             return;
  //           }
  //         }
  //       })
  //       .catch(err => {
  //         console.error('❌ Erreur lors de la vérification du statut:', err);
  //       });

  //     const handler = (status: string) => {
  //       console.log(`📨 Événement reçu pour paymentId ${paymentId}:`, status);
  //       subscriber.next({ data: { status } });
  //       // Fermer la connexion après avoir reçu l'événement
  //       if (status === 'PAID' || status === 'FAILED') {
  //         subscriber.complete();
  //       }
  //     };

  //     // Écouter les events uniquement pour ce paymentId
  //     console.log("🎧 Enregistrement du listener pour paymentId:", paymentId);
  //     paymentEvents.on(paymentId, handler);

  //     // Nettoyage
  //     return () => {
  //       console.log("🧹 Nettoyage du listener pour paymentId:", paymentId);
  //       paymentEvents.off(paymentId, handler);
  //     };
  //   });
  // }
  
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('USER', 'ORGANIZER', 'ADMIN')
  @Get()
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(+id);
  }
}
