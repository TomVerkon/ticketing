import { TicketUpdatedEvent } from '@tverkon-ticketing/common'
import { natsWrapper } from '../../../__mocks__/nats-wrapper'
import { TicketUpdatedListener } from '../ticket-updated-listener'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../model/ticket'

let waitMicroseconds = 20000

const setup = async () => {
  // create a fake instance of the listener
  // @ts-ignore
  const listener = new TicketUpdatedListener(natsWrapper.client)
  // create a ticket
  const ticket = Ticket.build({ title: 'stones Concert', price: 500.0 })
  await ticket.save()

  // create a fake data event
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    title: 'The Rolling Stones Concert',
    price: 1000,
    userId: 'abcdef',
    version: ticket.version + 1
  }
  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { ticket, listener, data, msg }
}

it(
  'should find and update a ticket',
  async () => {
    const { ticket, listener, data, msg } = await setup()
    // call the onMessage fn with data, and message objects
    await listener.onMessage(data, msg)
    // write assertions to make sure a ticket was created
    const updatedTicket = await Ticket.findById(ticket.id)
    expect(updatedTicket).toBeDefined()
    expect(updatedTicket.title).toEqual(data.title)
    expect(ticket.id).toEqual(data.id)
    expect(updatedTicket.version).toEqual(data.version)
  },
  waitMicroseconds
)

it(
  'should ack the message',
  async () => {
    const { listener, data, msg } = await setup()
    // call the onMessage fn with data, and message objects
    await listener.onMessage(data, msg)
    // write assertions to make sure ack fn was called
    expect(msg.ack).toBeCalledTimes(1)
  },
  waitMicroseconds
)

it(
  'should not process first message',
  async () => {
    const { listener, data, msg } = await setup()
    data.version = data.version + 1
    // call the onMessage fn with data, and message objects
    try {
      await listener.onMessage(data, msg)
    } catch (err) {}
    // write assertions to make sure ack fn was not called
    expect(msg.ack).not.toBeCalled()
  },
  waitMicroseconds
)
