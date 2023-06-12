import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderCancelledEvent, OrderStatus, NotFoundError } from '@tverkon-ticketing/common';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../model/order';
import { NotBeforeError } from 'jsonwebtoken';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const order = await Order.findByEvent(data);

    if (!order) {
      throw new NotFoundError();
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    msg.ack();
  }
}
