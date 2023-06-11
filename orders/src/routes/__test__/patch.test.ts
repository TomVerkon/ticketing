import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Ticket } from '../../model/ticket';
import { Order, OrderStatus } from '../../model/order';
import { natsWrapper } from '../../nats-wrapper';
import { StatusCode } from '@tverkon-ticketing/common';

const saveTicket = async () => {
  const ticket = Ticket.build({ title: 'Stones Concert', price: 500.0 });
  return await ticket.save();
};

let waitMicroseconds = 20000;

it(
  'returns an StatusCode.NotFoundError if requested orderId is not found',
  async () => {
    const ticket = await saveTicket();
    const cookie = global.signin();

    // Create one order for cookie user
    let response = await request(app)
      .post('/api/orders')
      .set('Cookie', cookie)
      .send({ ticketId: ticket.id })
      .expect(StatusCode.Created);

    // create a URL using a random orderId
    const url = `/api/orders/${new mongoose.Types.ObjectId()}`;
    response = await request(app).patch(url).set('Cookie', cookie).send().expect(StatusCode.NotFoundError);
  },
  waitMicroseconds
);

it(
  'returns an StatusCode.ForbiddenError if requested order belongs to some other user',
  async () => {
    const ticket = await saveTicket();

    let expectedStatus = 201;
    // Create one order for a random user
    let response = await request(app)
      .post('/api/orders')
      .set('Cookie', global.signin())
      .send({ ticketId: ticket.id })
      .expect(StatusCode.Created);
    //console.log(response.body);
    const url = `/api/orders/${response.body.id}`;
    expectedStatus = 403;
    response = await request(app).patch(url).set('Cookie', global.signin()).send().expect(StatusCode.ForbiddenError);
    //console.log(global.createMsg(expect.getState().currentTestName, expectedStatus.toString(), response));
  },
  waitMicroseconds
);

it(
  'returns a StatusCode.Updated if requested orderId is found and belongs to user',
  async () => {
    const ticket = Ticket.build({ title: 'Stones Concert', price: 500.0 });
    await ticket.save();

    const cookie = global.signin();

    // Create one order for user #1
    let { body: order } = await request(app)
      .post('/api/orders')
      .set('Cookie', cookie)
      .send({ ticketId: ticket.id })
      .expect(StatusCode.Created);

    const url = `/api/orders/${order.id}`;
    await request(app).patch(url).set('Cookie', cookie).send().expect(StatusCode.Updated);

    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder.status).toEqual(OrderStatus.Cancelled);
  },
  waitMicroseconds
);

it(
  'publishes an order cancelled event',
  async () => {
    const ticket = Ticket.build({ title: 'Stones Concert', price: 500.0 });
    await ticket.save();

    const cookie = global.signin();

    // Create one order for user #1
    let { body: order } = await request(app)
      .post('/api/orders')
      .set('Cookie', cookie)
      .send({ ticketId: ticket.id })
      .expect(StatusCode.Created);

    const url = `/api/orders/${order.id}`;
    await request(app).patch(url).set('Cookie', cookie).send().expect(StatusCode.Updated);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
  },
  waitMicroseconds
);
