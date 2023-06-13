import { Publisher, Subjects, PaymentCreatedEvent } from '@tverkon-ticketing/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
