import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../model/ticket'
import { natsWrapper } from '../../nats-wrapper'
import { StatusCode } from '@tverkon-ticketing/common'

let waitMicroseconds = 20000

it(
  'has a route handler listening to /api/tickets for POST requests',
  async () => {
    const response = await request(app).post('/api/tickets').send({ title: 'A title', price: 10.0 })
    expect(response.status).not.toEqual(StatusCode.NotFoundError)
  },
  waitMicroseconds
)

it('can only be accessed if user is signed in', async () => {
  const response = await request(app).post('/api/tickets').send({}).expect(StatusCode.NotAuthorizedError)
})

it('return a status other than StatusCode.NotAuthorizedError if user is signed in', async () => {
  const cookie = await global.signin()
  const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({})
  expect(response.status).not.toEqual(401)
  // console.log(global.createMsg(expect, "not 401", response.status));
})

it(
  'returns a StatusCode.RequestValidationError if invalid title is provided',
  async () => {
    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({ title: '', price: 10 })
      .expect(StatusCode.RequestValidationError)
    // console.log(global.createMsg(expect, StatusCode.RequestValidationError, response.status, response.text));
  },
  waitMicroseconds
)

it(
  'returns a StatusCode.RequestValidationError if no title is provided',
  async () => {
    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({ price: 10 })
      .expect(StatusCode.RequestValidationError)
    // console.log(global.createMsg(expect, StatusCode.RequestValidationError, response.status, response.text));
  },
  waitMicroseconds
)

it(
  'returns a StatusCode.RequestValidationError if invalid price is provided',
  async () => {
    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({ title: 'xyzzy', price: -10 })
      .expect(StatusCode.RequestValidationError)
    // console.log(global.createMsg(expect, StatusCode.RequestValidationError, response.status, response.text));
  },
  waitMicroseconds
)

it(
  'returns a StatusCode.RequestValidationError if no price is provided',
  async () => {
    let response = await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({ title: 'xyzzy' })
      .expect(StatusCode.RequestValidationError)
    // console.log(global.createMsg(expect, StatusCode.RequestValidationError, response.status, response.text));
  },
  waitMicroseconds
)

it(
  'creates a ticket if valid input is provided',
  async () => {
    let tickets = await Ticket.find({})
    expect(tickets.length).toEqual(0)

    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({ title: 'asdfghj', price: 20 })
      .expect(StatusCode.Created)
    // console.log(global.createMsg(expect, StatusCode.Created, response.status, response.text));

    tickets = await Ticket.find({})
    expect(tickets.length).toEqual(1)
  },
  waitMicroseconds
)

it(
  'publishes an event',
  async () => {
    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({ title: 'asdfghj', price: 20 })
      .expect(StatusCode.Created)

    expect(natsWrapper.client.publish).toHaveBeenCalled()
  },
  waitMicroseconds
)
