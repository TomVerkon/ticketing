import { Publisher, Subjects, OrderCancelledEvent } from "@tverkon-ticketing/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
