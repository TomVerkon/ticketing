import { Publisher, Subjects, TicketCreatedEvent } from "@tverkon-ticketing/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
