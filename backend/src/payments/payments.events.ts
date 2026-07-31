// implémenter un pub/sub redis dnas le cas d'un passage à Kubernetes

import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'node:events';

export type PaymentStatus =
  | 'PENDING'
  | 'PAID'
  | 'FAILED'
  | 'CANCELED';

export type PaymentStatusHandler = (
  status: PaymentStatus,
) => void;

@Injectable()
export class PaymentEventsService {
  private readonly emitter = new EventEmitter();

  constructor() {
    this.emitter.setMaxListeners(100);
  }

  emit(
    paymentId: number,
    status: PaymentStatus,
  ): void {
    this.emitter.emit(
      this.getEventName(paymentId),
      status,
    );
  }

  on(
    paymentId: number,
    handler: PaymentStatusHandler,
  ): void {
    this.emitter.on(
      this.getEventName(paymentId),
      handler,
    );
  }

  off(
    paymentId: number,
    handler: PaymentStatusHandler,
  ): void {
    this.emitter.off(
      this.getEventName(paymentId),
      handler,
    );
  }

  private getEventName(
    paymentId: number,
  ): string {
    return String(paymentId);
  }
}