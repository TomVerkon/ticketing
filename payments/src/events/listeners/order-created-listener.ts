import { Message } from 'node-nats-streaming'
import { Subjects, Listener, OrderCreatedEvent } from '@tverkon-ticketing/common'
import { queueGroupName } from './queue-group-name'
import { Order } from '../../model/order'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
  queueGroupName = queueGroupName

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const order = Order.build({
      id: data.id,
      status: data.status,
      version: data.version,
      userId: data.userId,
      price: data.ticket.price,
    })

    await order.save()

    msg.ack()
  }
}
