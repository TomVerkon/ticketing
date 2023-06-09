import { Message } from 'node-nats-streaming';
import { Subjects, Listener, ExpirationCompleteEvent, NotFoundError, OrderStatus } from '@tverkon-ticketing/common';
import { Order } from '../../model/order';
import { queueGroupName } from './queue-group-name';
import mongoose from 'mongoose';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const { orderId } = data;
    const order = await Order.findById(orderId).populate('ticket');
    if (!order) throw new NotFoundError();

    if (order.status !== OrderStatus.Complete) {
      order.set({ status: OrderStatus.Cancelled });
      await order.save();
      new OrderCancelledPublisher(this.client).publish({
        id: order.id,
        version: order.version,
        ticket: { id: order.ticket.id }
      });
    }

    msg.ack();
  }
}
