import { ExpirationCompleteEvent, OrderStatus } from '@tverkon-ticketing/common'
import { natsWrapper } from '../../../__mocks__/nats-wrapper'
import { ExpirationCompleteListener } from '../expiration-complete-listener'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../model/ticket'
import { Order } from '../../../model/order'

let waitMicroseconds = 20000

const setup = async () => {
  // create a fake instance of the listener
  // @ts-ignore
  const listener = new ExpirationCompleteListener(natsWrapper.client)

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'stones concert',
    price: 50
  })
  await ticket.save()

  const order = Order.build({
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: new Date(),
    status: OrderStatus.Created,
    ticket
  })
  await order.save()

  // create a fake data event
  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id
  }
  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg, ticket, order }
}

it(
  'updates the order status to Cancelled',
  async () => {
    const { listener, data, msg, ticket, order } = await setup()
    // call the onMessage fn with data, and message objects
    await listener.onMessage(data, msg)
    // write assertions to make sure a ticket was created
    const updatedOrder = await Order.findById(order.id).populate('ticket')
    expect(updatedOrder).toBeDefined()
    expect(updatedOrder.status).toEqual(OrderStatus.Cancelled)
    expect(updatedOrder.ticket.id).toEqual(ticket.id)
  },
  waitMicroseconds
)

it(
  'should emit a OrderCancelled event',
  async () => {
    const { listener, data, msg, ticket, order } = await setup()
    // call the onMessage fn with data, and message objects
    await listener.onMessage(data, msg)
    // write assertions to make sure a ticket was created
    const saranWrap = natsWrapper.client.publish as jest.Mock
    expect(saranWrap).toHaveBeenCalled()
    const eventData = JSON.parse(saranWrap.mock.calls[0][1])
    expect(eventData.id).toEqual(order.id)
  },
  waitMicroseconds
)

it(
  'should ack the message',
  async () => {
    const { listener, data, msg, ticket, order } = await setup()
    // call the onMessage fn with data, and message objects
    await listener.onMessage(data, msg)
    // write assertions to make sure ack fn was called
    expect(msg.ack).toBeCalledTimes(1)
  },
  waitMicroseconds
)
