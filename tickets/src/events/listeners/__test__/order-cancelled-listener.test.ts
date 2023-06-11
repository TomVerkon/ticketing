import { OrderCancelledEvent, OrderStatus, TicketUpdatedEvent } from '@tverkon-ticketing/common';
import { OrderCancelledListener } from '../order-cancelled-listener';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { natsWrapper } from '../../../__mocks__/nats-wrapper';
import { Ticket } from '../../../model/ticket';

let waitMicroseconds = 20000;

const setup = async () => {
  // create a fake instance of the listener
  // @ts-ignore
  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = new mongoose.Types.ObjectId().toHexString();
  // creste and save a ticket
  let ticket = await Ticket.build({
    title: 'stones concert',
    price: 150,
    userId: new mongoose.Types.ObjectId().toHexString()
  });
  ticket.set({ orderId });
  ticket = await ticket.save();
  // create a fake data event
  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id
    }
  };
  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { ticket, listener, data, msg };
};

it(
  'resets the orderId in the ticket which means it is available',
  async () => {
    const { listener, data, msg } = await setup();
    // call the onMessage fn with data, and message objects
    await listener.onMessage(data, msg);
    // write assertions to make sure the ticket orderId was updated
    const ticket = await Ticket.findById(data.ticket.id);
    expect(ticket).toBeDefined();
    expect(ticket.orderId).toBeUndefined();
    expect(ticket.id).toEqual(data.ticket.id);
  },
  waitMicroseconds
);

it(
  'acks the message',
  async () => {
    const { listener, data, msg } = await setup();
    // call the onMessage fn with data, and message objects
    await listener.onMessage(data, msg);
    // write assertions to make sure msg.ack was called
    expect(msg.ack).toHaveBeenCalled();
  },
  waitMicroseconds
);

it(
  'publishes a ticket updated event',
  async () => {
    const { listener, data, msg } = await setup();
    // call the onMessage fn with data, and message objects
    await listener.onMessage(data, msg);
    // write assertions to make sure msg.ack was called
    expect(natsWrapper.client.publish).toHaveBeenCalled();
    const ticketUpdatedData = JSON.parse(natsWrapper.client.publish.mock.calls[0][1]) as TicketUpdatedEvent['data'];
    expect(ticketUpdatedData.orderId).toBeUndefined();
  },
  waitMicroseconds
);
