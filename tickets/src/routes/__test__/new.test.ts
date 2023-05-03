import request from 'supertest';
import { app } from '../../app';
import { response } from 'express';

it('has a route handler listening to /api/tickets for POST requests', async () => {
  const response = await request(app).post('/api/tickets').send({});
  expect(response.status).not.toEqual(404);
});

it('can only be accessed if user is signed in', async () => {
  await request(app).post('/api/tickets').send({}).expect(401);
});

it('return a status other than 401 if user is signed in', async () => {
  const cookie = global.signin();
  //console.log(cookie);
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({});
  //console.log(response);
  expect(response.status).not.toEqual(401);
});

it('returns an error if invalid title is provided', async () => {});

it('returns an error if invalid price is provided', async () => {});

it('creates a ticket if valid input id provided', async () => {});
