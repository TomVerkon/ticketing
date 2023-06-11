import request from 'supertest'
import { app } from '../../app'
import { StatusCode } from '@tverkon-ticketing/common'

it('returns a StatusCode.Created on successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(StatusCode.Created)
  // console.log(global.createMsg(expect, "201", response.status, response.text));
})

it('returns a StatusCode.RequestValidationError with an invalid email', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({ email: 'testtest.com', password: 'password' })
    .expect(StatusCode.RequestValidationError)
})

it('returns a StatusCode.RequestValidationError with an invalid password', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'pass' })
    .expect(StatusCode.RequestValidationError)
})

it('returns a StatusCode.RequestValidationError with missing email', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({ email: null, password: 'password' })
    .expect(StatusCode.RequestValidationError)
})

it('returns a StatusCode.RequestValidationError with missing password', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: null })
    .expect(StatusCode.RequestValidationError)
})

it('return StatusCode.BadRequestError, disallows duplicate emails', async () => {
  // signup with email: "test@test.com", password: "password"
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(StatusCode.Created)
  const response = await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(StatusCode.BadRequestError)
})

it('sets a cookie on the session on successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(StatusCode.Created)
  expect(response.get('Set-Cookie')).toBeDefined()
  // console.log(global.createMsg(expect, "201", response.status, response.text));
})
