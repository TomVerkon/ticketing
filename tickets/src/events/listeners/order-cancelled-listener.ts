import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderCancelledEvent, NotFoundError } from '@tverkon-ticketing/common';
import { Ticket } from '../../model/ticket';
import { queueGroupName } from './queue-group-name';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    // Find the ticket the order is using
    const ticket = await Ticket.findById(data.ticket.id);
    // if no ticket, throw error
    if (!ticket) throw new NotFoundError();
    // mark the ticket as reserved by populating the orderId
    ticket.set({ orderId: undefined });
    // save the ticket
    await ticket.save();

    // let order service know that we updated the ticket
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
      orderId: ticket.orderId
    });

    // ack the message
    msg.ack();
  }
}
