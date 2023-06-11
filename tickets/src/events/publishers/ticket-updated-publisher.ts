import { Publisher, Subjects, TicketUpdatedEvent } from '@tverkon-ticketing/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated
}
