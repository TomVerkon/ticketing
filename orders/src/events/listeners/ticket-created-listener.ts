import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEvent } from "@tverkon-ticketing/common";
import { Ticket } from "../../model/ticket";
import { queueGroupName } from "./queue-group-name";
import mongoose from "mongoose";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    console.log(`Orders TicketCreateEvent:`, data);
    const { id, title, price, userId, version } = data;
    console.log(`id:${id}, title:${title}, version:${version}`);
    const ticket = new Ticket({
      _id: new mongoose.Types.ObjectId(id),
      title,
      price,
      version: version,
    });
    // const ticket = Ticket.build({
    //   id,
    //   title,
    //   price,
    // });
    console.log("before orders TickeCreatedListener save: ", ticket);
    await ticket.save();
    console.log("after orders TickeCreatedListener save: ", ticket);

    msg.ack();
  }
}
