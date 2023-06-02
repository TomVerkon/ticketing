import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { Ticket } from "../../model/ticket";
import { NotFoundError } from "@tverkon-ticketing/common";

let waitMicroseconds = 20000;

it(
  "returns a 404 if the ticket is not found",
  async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const response = await request(app).get(`/api/tickets/${id}`).send();
    expect(response.text).toContain("Route Not Found");
    expect(response.status).toBe(404);
    // console.log(global.createMsg(expect.getState().currentTestName, "404", response));
  },
  waitMicroseconds
);

it(
  "returns the ticket if the ticket is found",
  async () => {
    const title = "asdfghj";
    const price = 20;
    const userId = "xyzzy";
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    const ticket = Ticket.build({ title, price, userId });
    await ticket.save();

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);

    const response = await request(app).get(`/api/tickets/${ticket.id}`).expect(200);
    expect(response.body.title).toEqual(title);
    expect(response.body.price).toEqual(20);
    expect(response.body.userId).toEqual(userId);
    // console.log(global.createMsg(expect.getState().currentTestName, "200", response));
  },
  waitMicroseconds
);
