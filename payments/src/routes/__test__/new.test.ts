import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../model/order';
import { natsWrapper } from '../../nats-wrapper';
import { OrderStatus, StatusCode } from '@tverkon-ticketing/common';
import mongoose from 'mongoose';

let waitMicroseconds = 20000;

it(
  'returns a StatusCode.NotAuthorizedError if user not logged in',
  async () => {
    const response = await request(app).post('/api/payments').send({});
    expect(response.status).toEqual(StatusCode.NotAuthorizedError);
  },
  waitMicroseconds
);

it(
  'returns a StatusCode.NotFoundError if a bad orderId is passed in',
  async () => {
    const cookie = global.signin();
    const response = await request(app)
      .post('/api/payments')
      .set('Cookie', cookie)
      .send({ token: 'abcdef', orderId: new mongoose.Types.ObjectId().toHexString() });
    expect(response.status).toEqual(StatusCode.NotFoundError);
  },
  waitMicroseconds
);

it(
  'returns a StatusCode.ForbiddenError if order does not belong to this user',
  async () => {
    //const cookie = global.signin();
    const order = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      status: OrderStatus.Created,
      version: 0,
      userId: new mongoose.Types.ObjectId().toHexString(),
      price: 150,
    });
    await order.save();

    const response = await request(app)
      .post('/api/payments')
      .set('Cookie', global.signin())
      .send({ token: 'abcdef', orderId: order.id });
    expect(response.status).toEqual(StatusCode.ForbiddenError);
  },
  waitMicroseconds
);

it(
  'returns a StatusCode.BadRequestError if order is already cancelled',
  async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      status: OrderStatus.Cancelled,
      version: 0,
      userId: userId,
      price: 150,
    });
    await order.save();

    const response = await request(app)
      .post('/api/payments')
      .set('Cookie', global.signin(userId))
      .send({ token: 'abcdef', orderId: order.id });
    expect(response.status).toEqual(StatusCode.BadRequestError);
  },
  waitMicroseconds
);
