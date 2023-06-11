import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderCreatedEvent, NotFoundError } from '@tverkon-ticketing/common';
import { Ticket } from '../../model/ticket';
import { queueGroupName } from './queue-group-name';
import mongoose from 'mongoose';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';
import { natsWrapper } from '../../nats-wrapper';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find the ticket the order is using
    const ticket = await Ticket.findById(data.ticket.id);
    // if no ticket, throw error
    if (!ticket) throw new NotFoundError();
    // mark the ticket as reserved by populating the orderId
    ticket.set({ orderId: data.id });
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
