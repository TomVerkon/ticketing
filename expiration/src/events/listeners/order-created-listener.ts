import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderCreatedEvent, NotFoundError } from '@tverkon-ticketing/common';
import { queueGroupName } from './queue-group-name';
import { expirationQueue } from '../../queues/expiration-queue';
import { natsWrapper } from '../../nats-wrapper';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    console.log(data);

    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    //console.log("wait this many milliseconds to process the job:", delay);
    await expirationQueue.add({ orderId: data.id }, { delay: delay });
    msg.ack();
  }
}
