import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../model/order';
import { natsWrapper } from '../../nats-wrapper';
import { OrderStatus, StatusCode } from '@tverkon-ticketing/common';
import mongoose from 'mongoose';
import { stripe } from '../../stripe';
import { Payment } from '../../model/payment';

let waitMicroseconds = 30000;

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

it(
  'calls stripe successfully and returns StatusCode.Created',
  async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const price = Math.floor(Math.random() * 100000);
    const order = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      status: OrderStatus.Created,
      version: 0,
      userId,
      price,
    });
    await order.save();

    const response = await request(app)
      .post('/api/payments')
      .set('Cookie', global.signin(userId))
      .send({ token: 'tok_visa', orderId: order.id })
      .expect(StatusCode.Created);

    const stripeCharges = await stripe.charges.list({ limit: 10 });
    const stripeCharge = stripeCharges.data.find(charge => {
      return charge.amount === price * 100;
    });

    expect(stripeCharge).toBeDefined();
    expect(stripeCharge.amount).toEqual(order.price * 100);
    expect(stripeCharge.currency).toEqual('usd');
  },
  waitMicroseconds
);

it(
  'returns a StatusCode.BadRequestError if bad token used',
  async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const price = Math.floor(Math.random() * 100000);
    const order = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      status: OrderStatus.Created,
      version: 0,
      userId,
      price,
    });
    await order.save();

    const response = await request(app)
      .post('/api/payments')
      .set('Cookie', global.signin(userId))
      .send({ token: 'bad_tok_visa', orderId: order.id })
      .expect(StatusCode.BadRequestError);
  },
  waitMicroseconds
);

it(
  'creates a payment record in the db',
  async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const price = Math.floor(Math.random() * 100000);
    const order = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      status: OrderStatus.Created,
      version: 0,
      userId,
      price,
    });
    await order.save();

    const response = await request(app)
      .post('/api/payments')
      .set('Cookie', global.signin(userId))
      .send({ token: 'tok_visa', orderId: order.id })
      .expect(StatusCode.Created);

    const stripeCharges = await stripe.charges.list({ limit: 10 });
    const stripeCharge = stripeCharges.data.find(charge => {
      return charge.amount === price * 100;
    });
    expect(stripeCharge).toBeDefined();
    expect(stripeCharge.amount).toEqual(order.price * 100);
    expect(stripeCharge.currency).toEqual('usd');

    const payment = await Payment.findOne({ orderId: order.id, paymentId: stripeCharge.id });
    expect(payment).not.toBeNull();
  },
  waitMicroseconds
);

it(
  'publishes an event',
  async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const price = Math.floor(Math.random() * 100000);
    const order = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      status: OrderStatus.Created,
      version: 0,
      userId,
      price,
    });
    await order.save();

    const response = await request(app)
      .post('/api/payments')
      .set('Cookie', global.signin(userId))
      .send({ token: 'tok_visa', orderId: order.id })
      .expect(StatusCode.Created);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  },
  waitMicroseconds
);
