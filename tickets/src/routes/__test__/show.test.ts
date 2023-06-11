import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Ticket } from '../../model/ticket';
import { NotFoundError, StatusCode } from '@tverkon-ticketing/common';

let waitMicroseconds = 20000;

it(
  'returns a 404 if the ticket is not found',
  async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const response = await request(app).get(`/api/tickets/${id}`).send().expect(StatusCode.NotFoundError);
    // console.log(global.createMsg(expect, StatusCode.NotFoundError, response.status, response.text));
  },
  waitMicroseconds
);

it(
  'returns the ticket if the ticket is found',
  async () => {
    const title = 'asdfghj';
    const price = 20;
    const userId = 'xyzzy';
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    const ticket = Ticket.build({ title, price, userId });
    await ticket.save();

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);

    const response = await request(app).get(`/api/tickets/${ticket.id}`).expect(StatusCode.OK);
    expect(response.body.title).toEqual(title);
    expect(response.body.price).toEqual(price);
    expect(response.body.userId).toEqual(userId);
    // console.log(global.createMsg(expect, StatusCode.OK, response.status, response.text));
  },
  waitMicroseconds
);
