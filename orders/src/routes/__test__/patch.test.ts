import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { Ticket } from "../../model/ticket";
import { Order, OrderStatus } from "../../model/order";
import { natsWrapper } from "../../nats-wrapper";

const saveTicket = async () => {
  const ticket = Ticket.build({ title: "Stones Concert", price: 500.0 });
  return await ticket.save();
};

it("returns an 404 if requested orderId is not found", async () => {
  const ticket = await saveTicket();
  const cookie = global.signin();

  let expectedStatus = 201;
  // Create one order for cookie user
  let response = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id })
    .expect(expectedStatus);

  // create a URL using a random orderId
  const url = `/api/orders/${new mongoose.Types.ObjectId()}`;
  expectedStatus = 404;
  response = await request(app).patch(url).set("Cookie", cookie).send().expect(expectedStatus);
  //console.log(global.createMsg(expect.getState().currentTestName, expectedStatus.toString(), response));
});

it("returns an 403 if requested order belongs to some other user", async () => {
  const ticket = await saveTicket();

  let expectedStatus = 201;
  // Create one order for a random user
  let response = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(expectedStatus);
  //console.log(response.body);
  const url = `/api/orders/${response.body.id}`;
  expectedStatus = 403;
  response = await request(app).patch(url).set("Cookie", global.signin()).send().expect(expectedStatus);
  //console.log(global.createMsg(expect.getState().currentTestName, expectedStatus.toString(), response));
});

it("returns an 204 if requested orderId is found and belongs to user", async () => {
  const ticket = Ticket.build({ title: "Stones Concert", price: 500.0 });
  await ticket.save();

  const cookie = global.signin();

  let expectedStatus = 201;
  // Create one order for user #1
  let { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id })
    .expect(expectedStatus);

  const url = `/api/orders/${order.id}`;
  expectedStatus = 204;
  await request(app).patch(url).set("Cookie", cookie).send().expect(expectedStatus);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder.status).toEqual(OrderStatus.Cancelled);
  //console.log(global.createMsg(expect.getState().currentTestName, expectedStatus.toString(), response));
});

it("publishes an order cancelled event", async () => {
  const ticket = Ticket.build({ title: "Stones Concert", price: 500.0 });
  await ticket.save();

  const cookie = global.signin();

  let expectedStatus = 201;
  // Create one order for user #1
  let { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id })
    .expect(expectedStatus);

  const url = `/api/orders/${order.id}`;
  expectedStatus = 204;
  await request(app).patch(url).set("Cookie", cookie).send().expect(expectedStatus);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
