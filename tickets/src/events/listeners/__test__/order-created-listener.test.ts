import { OrderCreatedEvent, OrderStatus } from "@tverkon-ticketing/common";
import { OrderCreatedListener } from "../order-created-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { natsWrapper } from "../../../__mocks__/nats-wrapper";
import { Ticket } from "../../../model/ticket";

let waitMicroseconds = 20000;

const setup = async () => {
  // create a fake instance of the listener
  // @ts-ignore
  const listener = new OrderCreatedListener(natsWrapper.client);
  // creste and save a ticket
  let ticket = await Ticket.build({
    title: "stones concert",
    price: 150,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  ticket = await ticket.save();
  // create a fake data event
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    expiresAt: new Date().toISOString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };
  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { ticket, listener, data, msg };
};

it(
  "sets the orderId in the ticket which means it has been reserved",
  async () => {
    const { listener, data, msg } = await setup();
    // call the onMessage fn with data, and message objects
    await listener.onMessage(data, msg);
    // write assertions to make sure the ticket orderId was updated
    const ticket = await Ticket.findById(data.ticket.id);
    expect(ticket).toBeDefined();
    expect(ticket.orderId).toEqual(data.id);
    expect(ticket.id).toEqual(data.ticket.id);
  },
  waitMicroseconds
);

it(
  "acks the message",
  async () => {
    const { listener, data, msg } = await setup();
    // call the onMessage fn with data, and message objects
    await listener.onMessage(data, msg);
    // write assertions to make sure msg.ack was called
    expect(msg.ack).toHaveBeenCalled();
  },
  waitMicroseconds
);
