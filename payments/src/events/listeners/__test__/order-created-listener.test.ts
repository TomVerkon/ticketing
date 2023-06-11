import { OrderCreatedEvent, OrderStatus, TicketUpdatedEvent } from '@tverkon-ticketing/common';
import { OrderCreatedListener } from '../order-created-listener';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { natsWrapper } from '../../../__mocks__/nats-wrapper';
import { Order } from '../../../model/order';

let waitMicroseconds = 20000;

const setup = async () => {
  // create a fake instance of the listener
  // @ts-ignore
  const listener = new OrderCreatedListener(natsWrapper.client);

  // create a fake data event
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    version: 0,
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: new Date().toISOString(),
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
      price: 150,
    },
  };
  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it(
  'replicates the order info',
  async () => {
    const { listener, data, msg } = await setup();
    // call the onMessage fn with data, and message objects
    await listener.onMessage(data, msg);
    // write assertions to make sure the ticket orderId was updated
    const order = await Order.findById(data.id);
    expect(order).toBeDefined();
    expect(order.id).toEqual(data.id);
    expect(order.price).toEqual(data.ticket.price);
    expect(order.version).toEqual(data.version);
    expect(order.status).toEqual(data.status);
    expect(order.userId).toEqual(data.userId);
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

// it(
//   "publishes a ticket updated event",
//   async () => {
//     const { listener, data, msg } = await setup();
//     // call the onMessage fn with data, and message objects
//     await listener.onMessage(data, msg);
//     // write assertions to make sure msg.ack was called
//     expect(natsWrapper.client.publish).toHaveBeenCalled();
//     const ticketUpdatedData = JSON.parse(natsWrapper.client.publish.mock.calls[0][1]) as TicketUpdatedEvent["data"];
//     expect(data.id).toEqual(ticketUpdatedData.orderId);
//   },
//   waitMicroseconds
// );
