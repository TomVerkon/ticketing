import { NotFoundError } from "@tverkon-ticketing/common";
import { Ticket, TicketDoc } from "../ticket";

it("implements optomistic concurrency control", async () => {
  // create an instance of a ticket
  const ticket = Ticket.build({ title: "concert", price: 5.0, userId: "abcdef" });

  // save an instance of this ticket
  const savedTicket = await ticket.save();

  // fetch the ticket twice
  let firstInstance = await Ticket.findById(savedTicket.id);
  expect(firstInstance).not.toBeNull();
  expect(firstInstance.price).toEqual(5);
  let secondInstance = await Ticket.findById(savedTicket.id);
  expect(secondInstance).not.toBeNull();
  expect(secondInstance.price).toEqual(5);

  // make two separate chenges to the tickets we just fetched
  firstInstance.set({ price: 10 });
  secondInstance.set({ price: 15 });

  // save the firstInstance
  await firstInstance!.save();
  expect(firstInstance.price).toEqual(10);
  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }
  throw new Error("saving second instance should have thrown an error");
});

it("tests the version number gets incremented after a update", async () => {
  // create an instance of a ticket
  let ticket = Ticket.build({ title: "concert", price: 5.0, userId: "abcdef" });

  // save an instance of this ticket
  await ticket.save();
  expect(ticket.price).toEqual(5);
  expect(ticket.version).toEqual(0);

  ticket.set({ price: 10 });
  await ticket.save();
  expect(ticket.price).toEqual(10);
  expect(ticket.version).toEqual(1);

  ticket.set({ price: 15 });
  await ticket.save();
  expect(ticket.price).toEqual(15);
  expect(ticket.version).toEqual(2);
});
