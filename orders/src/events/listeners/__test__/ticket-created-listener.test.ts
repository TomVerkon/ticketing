import { TicketCreatedEvent } from "@tverkon-ticketing/common";
import { natsWrapper } from "../../../__mocks__/nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../model/ticket";

let waitMicroseconds = 20000;

const setup = async () => {
  // create a fake instance of the listener
  // @ts-ignore
  const listener = new TicketCreatedListener(natsWrapper.client);
  // create a fake data event
  const data: TicketCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "The title",
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
  };
  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it(
  "should create and save a ticket",
  async () => {
    const { listener, data, msg } = await setup();
    // call the onMessage fn with data, and message objects
    await listener.onMessage(data, msg);
    // write assertions to make sure a ticket was created
    const ticket = await Ticket.findById(new mongoose.Types.ObjectId(data.id));
    expect(ticket).toBeDefined();
    expect(ticket.title).toEqual(data.title);
    expect(ticket.id).toEqual(data.id);
  },
  waitMicroseconds
);

it(
  "should ack the message",
  async () => {
    const { listener, data, msg } = await setup();
    // call the onMessage fn with data, and message objects
    await listener.onMessage(data, msg);
    // write assertions to make sure ack fn was called
    expect(msg.ack).toBeCalledTimes(1);
  },
  waitMicroseconds
);
