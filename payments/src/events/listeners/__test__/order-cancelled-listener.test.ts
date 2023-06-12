/* eslint-disable @typescript-eslint/ban-ts-comment */
import { OrderCancelledEvent, OrderStatus, consoleLog } from '@tverkon-ticketing/common';
import { OrderCancelledListener } from '../order-cancelled-listener';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { natsWrapper } from '../../../__mocks__/nats-wrapper';
import { Order } from '../../../model/order';

const waitMicroseconds = 20000;

const setup = async () => {
  // create a fake instance of the listener
  // @ts-ignore
  const listener = new OrderCancelledListener(natsWrapper.client);

  let order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 150,
    userId: 'abcdef',
    status: OrderStatus.Created,
    version: 0,
  });

  order = await order.save();

  // create a fake data event
  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: order.version + 1,
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
    },
  };
  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, order };
};

it(
  'changes the OrderStatus to Cancelled in the order info',
  async () => {
    const { listener, data, msg, order } = await setup();
    // call the onMessage fn with data, and message objects
    await listener.onMessage(data, msg);
    // write assertions to make sure the ticket orderId was updated
    const cancelledOrder = await Order.findById(data.id);
    expect(cancelledOrder).toBeDefined();
    expect(cancelledOrder.id).toEqual(data.id);
    //expect(order.version).toEqual(data.version)
    expect(cancelledOrder.status).toEqual(OrderStatus.Cancelled);
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
