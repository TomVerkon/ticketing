import { Message } from 'node-nats-streaming'
import { Subjects, Listener, OrderCancelledEvent, OrderStatus } from '@tverkon-ticketing/common'
import { queueGroupName } from './queue-group-name'
import { Order } from '../../model/order'

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
  queueGroupName = queueGroupName

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const order = await Order.findById(data.id)

    order.set({ status: OrderStatus.Cancelled })
    await order.save()

    msg.ack()
  }
}
