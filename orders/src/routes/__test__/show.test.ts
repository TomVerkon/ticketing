import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../model/order';
import { Ticket } from '../../model/ticket';
import mongoose from 'mongoose';
import { StatusCode } from '@tverkon-ticketing/common';

const saveTicket = async () => {
  const ticket = Ticket.build({ title: 'Stones Concert', price: 500.0 });
  return await ticket.save();
};

let waitMicroseconds = 20000;

it(
  'returns a StatusCode.NotFoundError if requested orderId is not found',
  async () => {
    const ticket = await saveTicket();
    const cookie = global.signin();

    // Create one order for cookie user
    await request(app)
      .post('/api/orders')
      .set('Cookie', cookie)
      .send({ ticketId: ticket.id })
      .expect(StatusCode.Created);

    // create a URL using a random orderId
    const url = `/api/orders/${new mongoose.Types.ObjectId()}`;
    await request(app).get(url).set('Cookie', cookie).send().expect(StatusCode.NotFoundError);
  },
  waitMicroseconds
);

it(
  'returns a StatusCode.ForbiddenError if requested order belongs to some other user',
  async () => {
    const ticket = await saveTicket();

    // Create one order for a random user
    const response = await request(app)
      .post('/api/orders')
      .set('Cookie', global.signin())
      .send({ ticketId: ticket.id })
      .expect(StatusCode.Created);
    await request(app)
      .get(`/api/orders/${response.body.id}`)
      .set('Cookie', global.signin())
      .send()
      .expect(StatusCode.ForbiddenError);
  },
  waitMicroseconds
);

it(
  'returns a StatusCode.OK if requested orderId is found and belongs to user',
  async () => {
    const ticket = Ticket.build({ title: 'Stones Concert', price: 500.0 });
    await ticket.save();

    const cookie = global.signin();

    // Create one order for user #1
    let response = await request(app)
      .post('/api/orders')
      .set('Cookie', cookie)
      .send({ ticketId: ticket.id })
      .expect(StatusCode.Created);

    response = await request(app)
      .get(`/api/orders/${response.body.id}`)
      .set('Cookie', cookie)
      .send()
      .expect(StatusCode.OK);
    // console.log(global.createMsg(expect, StatusCode.OK, response.status, response.text));
  },
  waitMicroseconds
);
