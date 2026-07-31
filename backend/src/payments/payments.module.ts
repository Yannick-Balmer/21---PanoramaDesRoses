import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { StripeModule } from 'src/stripe/stripe.module';
import { StripeWebhookController } from './stripe-webhook.controller';
import { PaymentEventsService } from './payments.events';


@Module({
  imports: [StripeModule],
  controllers: [PaymentsController, StripeWebhookController],
  providers: [PaymentsService, PaymentEventsService,],
  exports: [PaymentsService, PaymentEventsService,],
})
export class PaymentsModule {}
