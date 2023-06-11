import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../model/ticket';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';
import { Order, OrderStatus } from '../../model/order';
import { StatusCode } from '@tverkon-ticketing/common';

let waitMicroseconds = 20000;

it(
  'returns a StatusCode.NotAuthorizedError if user is not authenticated',
  async () => {
    await request(app)
      .post('/api/orders')
      .send({ ticketId: '645e9e09596ba4d22841ce34' })
      .expect(StatusCode.NotAuthorizedError);
  },
  waitMicroseconds
);

it(
  'returns an status of StatusCode.RequestValidationError if ticketId is empty',
  async () => {
    await request(app)
      .post('/api/orders')
      .set('Cookie', global.signin())
      .send({ ticketId: null })
      .expect(StatusCode.RequestValidationError);
  },
  waitMicroseconds
);

it(
  'returns an status of 400 if ticketId is not a valid ObjectId',
  async () => {
    await request(app)
      .post('/api/orders')
      .set('Cookie', global.signin())
      .send({ ticketId: 'asdfgh' })
      .expect(StatusCode.RequestValidationError);
  },
  waitMicroseconds
);

it(
  'returns a status 0f 400 if ticket does not exist',
  async () => {
    const response = await request(app)
      .post('/api/orders')
      .set('Cookie', global.signin())
      .send({ ticketId: new mongoose.Types.ObjectId() })
      .expect(StatusCode.BadRequestError);
  },
  waitMicroseconds
);

it(
  'returns a 400 if the ticket has been reserved',
  async () => {
    const ticket = Ticket.build({ title: 'Stones Concert', price: 500.0 });
    await ticket.save();

    const order = Order.build({ userId: 'xyzzyx', status: OrderStatus.Created, expiresAt: new Date(), ticket });
    await order.save();

    const response = await request(app)
      .post('/api/orders')
      .set('Cookie', global.signin())
      .send({ ticketId: ticket.id });
    expect(response.status).toEqual(StatusCode.BadRequestError);
  },
  waitMicroseconds
);

it(
  'returns a 201, an order and reserves the ticket',
  async () => {
    let orderCount = await Order.count({});
    expect(orderCount).toEqual(0);

    const ticket = Ticket.build({ title: 'Stones Concert', price: 500.0 });
    await ticket.save();
    const ticketId = ticket.id;

    const expectedStatus = StatusCode.Created;
    const response = await request(app)
      .post('/api/orders')
      .set('Cookie', global.signin())
      .send({ ticketId: ticket.id });
    expect(response.status).toEqual(expectedStatus);
    expect(response.body.ticket.id).toEqual(ticketId);

    orderCount = await Order.count({});
    expect(orderCount).toEqual(1);
    // console.log(global.createMsg(expect, expectedStatus, response.status, response.text));
  },
  waitMicroseconds
);

it(
  'publishes an order created event',
  async () => {
    const ticket = Ticket.build({ title: 'Stones Concert', price: 500.0 });
    await ticket.save();
    const ticketId = ticket.id;

    const response = await request(app)
      .post('/api/orders')
      .set('Cookie', global.signin())
      .send({ ticketId: ticket.id });
    expect(response.status).toEqual(StatusCode.Created);
    expect(response.body.ticket.id).toEqual(ticketId);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
  },
  waitMicroseconds
);
