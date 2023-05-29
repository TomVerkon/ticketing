import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEvent } from "@tverkon-ticketing/common";
import { Ticket } from "../../model/ticket";
import { queueGroupName } from "./queue-group-name";
import mongoose from "mongoose";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { id, title, price, userId, version } = data;
    const ticket = new Ticket({
      _id: new mongoose.Types.ObjectId(id),
      title,
      price,
      version: version,
    });
    await ticket.save();

    msg.ack();
  }
}
