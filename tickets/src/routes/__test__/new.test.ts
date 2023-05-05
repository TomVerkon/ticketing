import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../model/ticket";

it("has a route handler listening to /api/tickets for POST requests", async () => {
  const response = await request(app).post("/api/tickets").send({ title: "A title", price: 10.0 });
  expect(response.status).not.toEqual(404);
  console.log(global.createMsg(expect.getState().currentTestName, "not 404", response));
});

it("can only be accessed if user is signed in", async () => {
  const response = await request(app).post("/api/tickets").send({}).expect(401);
  console.log(global.createMsg(expect.getState().currentTestName, "401", response));
});

it("return a status other than 401 if user is signed in", async () => {
  const cookie = await global.signin();
  const response = await request(app).post("/api/tickets").set("Cookie", cookie).send({});
  expect(response.status).not.toEqual(401);
  console.log(global.createMsg(expect.getState().currentTestName, "not 401", response));
});

it("returns an error if invalid title is provided", async () => {
  const cookie = await global.signin();
  let response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "", price: 10 })
    .expect(400);
  console.log(global.createMsg(expect.getState().currentTestName, "400", response));
});

it("returns an error if no title is provided", async () => {
  const cookie = await global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ price: 10 })
    .expect(400);
  console.log(global.createMsg(expect.getState().currentTestName, "400", response));
});

it("returns an error if invalid price is provided", async () => {
  const cookie = await global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "xyzzy", price: -10 })
    .expect(400);
  console.log(global.createMsg(expect.getState().currentTestName, "400", response));
});

it("returns an error if no price is provided", async () => {
  const cookie = await global.signin();
  let response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "xyzzy" })
    .expect(400);
  console.log(global.createMsg(expect.getState().currentTestName, "400", response));
});

it("creates a ticket if valid input is provided", async () => {
  const cookie = await global.signin();
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);
  const response = await await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "asdfghj", price: 20 })
    .expect(201);
  console.log(global.createMsg(expect.getState().currentTestName, "201", response));
  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
});
