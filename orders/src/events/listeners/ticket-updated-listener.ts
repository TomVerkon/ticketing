import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketUpdatedEvent } from "@tverkon-ticketing/common";
import { Ticket } from "../../model/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const { id, title, price } = data;
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      throw new Error(`Ticket not found: ${id}`);
    }
    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
