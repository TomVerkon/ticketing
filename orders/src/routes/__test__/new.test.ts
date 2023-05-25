import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../model/ticket";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";
import { Order, OrderStatus } from "../../model/order";

it("returns a status of 401 if user is not authenticated", async () => {
  const expectedStatus = 401;
  const response = await request(app).post("/api/orders").send({ ticketId: "645e9e09596ba4d22841ce34" });
  expect(response.status).toEqual(expectedStatus);
  // console.log(global.createMsg(expect.getState().currentTestName, expectedStatus.toString(), response));
});

it("returns an status of 400 if ticketId is empty", async () => {
  const expectedStatus = 400;
  let response = await request(app).post("/api/orders").set("Cookie", global.signin()).send({ ticketId: null });
  expect(response.status).toEqual(400);
  // console.log(global.createMsg(expect.getState().currentTestName, expectedStatus.toString(), response));
});

it("returns an status of 400 if ticketId is not a valid ObjectId", async () => {
  const expectedStatus = 400;
  let response = await request(app).post("/api/orders").set("Cookie", global.signin()).send({ ticketId: "asdfgh" });
  expect(response.status).toEqual(400);
  // console.log(global.createMsg(expect.getState().currentTestName, expectedStatus.toString(), response));
});

it("returns a status 0f 400 if ticket does not exist", async () => {
  const expectedStatus = 400;
  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: new mongoose.Types.ObjectId() });
  expect(response.status).toEqual(expectedStatus);
  // console.log(global.createMsg(expect.getState().currentTestName, expectedStatus.toString(), response));
});

it("returns a 400 if the ticket has been reserved", async () => {
  const ticket = Ticket.build({ title: "Stones Concert", price: 500.0 });
  await ticket.save();

  const order = Order.build({ userId: "xyzzyx", status: OrderStatus.Created, expiresAt: new Date(), ticket });
  await order.save();

  const expectedStatus = 400;
  const response = await request(app).post("/api/orders").set("Cookie", global.signin()).send({ ticketId: ticket.id });
  expect(response.status).toEqual(expectedStatus);
  // console.log(global.createMsg(expect.getState().currentTestName, expectedStatus.toString(), response));
});

it("returns a 201, an order and reserves the ticket", async () => {
  let orderCount = await Order.count({});
  expect(orderCount).toEqual(0);

  const ticket = Ticket.build({ title: "Stones Concert", price: 500.0 });
  await ticket.save();
  const ticketId = ticket.id;

  const expectedStatus = 201;
  const response = await request(app).post("/api/orders").set("Cookie", global.signin()).send({ ticketId: ticket.id });
  expect(response.status).toEqual(expectedStatus);
  expect(response.body.ticket.id).toEqual(ticketId);

  orderCount = await Order.count({});
  expect(orderCount).toEqual(1);
  // console.log(global.createMsg(expect.getState().currentTestName, expectedStatus.toString(), response));
});

it("publishes an order created event", async () => {
  const ticket = Ticket.build({ title: "Stones Concert", price: 500.0 });
  await ticket.save();
  const ticketId = ticket.id;

  const expectedStatus = 201;
  const response = await request(app).post("/api/orders").set("Cookie", global.signin()).send({ ticketId: ticket.id });
  expect(response.status).toEqual(expectedStatus);
  expect(response.body.ticket.id).toEqual(ticketId);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
