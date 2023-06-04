import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../model/ticket";

it("returns a 404 if provided ticket does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({ title: "asdfghj", price: 35.5 })
    .expect(404);
  //console.log(global.createMsg(expect.getState().currentTestName, "404", response));
});

it("returns a 401 if user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app).put(`/api/tickets/${id}`).send({ title: "asdfghj", price: 35.5 }).expect(401);
  //console.log(global.createMsg(expect.getState().currentTestName, "401", response));
});

it("returns a 403 if user does not own the ticket", async () => {
  let response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "asdfghj", price: 25 })
    .expect(201);
  // console.log(global.createMsg(expect.getState().currentTestName, "201", response));

  response = await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({ title: "querty", price: 35.5 })
    .expect(403);
  //console.log(global.createMsg(expect.getState().currentTestName, "403", response));
});

it("returns a 400 if provided an invalid title or price", async () => {
  const cookie = global.signin();
  let response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "asdfghj", price: 25 })
    .expect(201);
  // console.log(global.createMsg(expect.getState().currentTestName, "201", response));

  response = await request(app).put(`/api/tickets/${response.body.id}`).set("Cookie", cookie).send({}).expect(400);
  // console.log(global.createMsg(expect.getState().currentTestName, "403", response));
});

it("updates the ticket provided valid inputs", async () => {
  const cookie = global.signin();
  let response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "asdfghj", price: 25 })
    .expect(201);
  // console.log(global.createMsg(expect.getState().currentTestName, "201", response));

  response = await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "The title", price: 1000.0 })
    .expect(200);

  const ticket = response.body;
  expect(ticket.title).toEqual("The title");
  expect(ticket.price).toEqual(1000.0);
  //console.log(global.createMsg(expect.getState().currentTestName, "403", response));
});

it("publishes an event on create ticket", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "asdfghj", price: 20 })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("publishes an event on update ticket", async () => {
  const cookie = global.signin();
  let response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "asdfghj", price: 25 })
    .expect(201);
  // console.log(global.createMsg(expect.getState().currentTestName, "201", response));
  expect(natsWrapper.client.publish).toHaveBeenCalled();

  response = await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "The title", price: 1000.0 })
    .expect(200);

  expect(natsWrapper.client.publish).toBeCalledTimes(2);
});

it("returns a 400 if ticket is already reserved (orderId is defined)", async () => {
  const cookie = global.signin();
  const orderId = new mongoose.Types.ObjectId().toHexString();
  let response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "asdfghj", price: 25 })
    .expect(201);
  const updateUrl = `/api/tickets/${response.body.id}`;
  const ticket = await Ticket.findById(response.body.id);
  ticket.set({ orderId: orderId });
  await ticket.save();

  response = await request(app).put(updateUrl).set("Cookie", cookie).send({ title: "querty", price: 100 }).expect(400);
  const updatedTicket = await Ticket.findById(response.body.id);
  //console.log(global.createMsg(expect.getState().currentTestName, "403", response));
});
