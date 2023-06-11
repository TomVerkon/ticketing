import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';

declare global {
  var signup: () => Promise<string[]>;
  /**
   * This function in meant to display formatted output while testing
   * @param {jest.Expect} title - Test name will be obtained by calling title.getState().currentTestName
   * @param {string | number} expected - The expected result
   * @param {string | number} actual - The actual result
   * @param {string} response? - pass response.text in to format/display what is returned to the client
   */
  var createMsg: (title: jest.Expect, expected: string | number, actual: string | number, response?: string) => string;
}

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'asdfasdf';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  if (mongo) {
    await mongo.stop();
  }
});

global.signup = async () => {
  const email = 'test@test.com';
  const password = 'password';
  const response = await request(app).post('/api/users/signup').send({ email, password }).expect(201);
  const cookie = response.get('Set-Cookie');
  //console.log("cookie", cookie);
  return cookie;
};

/**
 * This function in meant to display formatted output while testing
 * @param {jest.Expect} title - Test name will be obtained by calling title.getState().currentTestName
 * @param {string | number} expected - The expected result
 * @param {string | number} actual - The actual result
 * @param {string} response? - pass response.text in to format/display what is returned to the client
 */
global.createMsg = (
  title: jest.Expect,
  expected: string | number,
  actual: string | number,
  response?: string
): string => {
  const testName = title.getState().currentTestName;
  const msgPrefix = `${testName}\nexpected: ${expected.toString()}, returned: ${actual.toString()}`;
  let msgSuffix = '';
  if (response) {
    msgSuffix = `\n${JSON.stringify(JSON.parse(response), null, 2)}`;
  }
  return `${msgPrefix}${msgSuffix}`;
};
