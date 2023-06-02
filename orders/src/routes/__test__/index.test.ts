import request from "supertest";
import { app } from "../../app";
import { Order } from "../../model/order";
import { Ticket } from "../../model/ticket";

const saveTicket = async () => {
  const ticket = Ticket.build({ title: "Stones Concert", price: 500.0 });
  return await ticket.save();
};

it("returns all the orders with tickets assigned to the authorized user", async () => {
  // Create three tickets
  const ticket1 = await saveTicket();
  const ticket2 = await saveTicket();
  const ticket3 = await saveTicket();

  const expectedStatus = 201;
  // Create one order for user #1
  let response = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket1.id })
    .expect(expectedStatus);

  const cookie = global.signin();
  // Create two orders for user #2

  const { body: orderTwo } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket2.id })
    .expect(expectedStatus);

  const { body: orderThree } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket3.id })
    .expect(expectedStatus);

  // Make a request to get orders for user #2
  response = await request(app).get("/api/orders").set("Cookie", cookie).send({});
  // Make sure we got back the orders for user #2
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderTwo.id);
  expect(response.body[1].id).toEqual(orderThree.id);
}, 10000);
