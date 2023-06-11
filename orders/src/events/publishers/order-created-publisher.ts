import { Publisher, Subjects, OrderCreatedEvent } from '@tverkon-ticketing/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
