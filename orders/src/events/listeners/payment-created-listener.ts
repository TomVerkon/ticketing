import { Message } from 'node-nats-streaming';
import { Subjects, Listener, PaymentCreatedEvent, NotFoundError, OrderStatus } from '@tverkon-ticketing/common';
import { Order } from '../../model/order';
import { queueGroupName } from './queue-group-name';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const { orderId } = data;
    const order = await Order.findById(orderId);
    if (!order) throw new NotFoundError();

    order.set({ status: OrderStatus.Complete });
    await order.save();

    msg.ack();
  }
}
