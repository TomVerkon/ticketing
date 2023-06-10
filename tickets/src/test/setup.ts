import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import request from "supertest";
import { app } from "../app";

declare global {
  var signin: () => string[];
  /**
   * This function in meant to display formatted output while testing
   * @param {jest.Expect} title - Test name will be obtained by calling title.getState().currentTestName
   * @param {string | number} expected - The expected result
   * @param {string | number} actual - The actual result
   * @param {string} response? - pass response.text in to format/display what is returned to the client
   */
  var createMsg: (title: jest.Expect, expected: string | number, actual: string | number, response?: string) => string;
}

jest.mock("../nats-wrapper");

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = "asdf";

  let mongo;
  try {
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri, {});
  } catch (err) {
    throw err;
  }
});

beforeEach(async () => {
  jest.clearAllMocks();
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

global.signin = () => {
  // build a JWT payload. {id, email}
  const payload = { id: new mongoose.Types.ObjectId().toHexString(), email: "test@test.com" };
  // create JWT
  const token = jwt.sign(payload, "asdf");
  // build a session Object. {jwt: MyJWT}
  const session = { jwt: token };
  // turn that session   into JSON
  const sessionJSON = JSON.stringify(session);
  // take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");
  //console.log('base64', base64);
  // return a string that is the cookie with the encoded data
  return [`session=${base64}`.trim()];
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
  let msgSuffix = "";
  if (response) {
    msgSuffix = `\n${JSON.stringify(JSON.parse(response), null, 2)}`;
  }
  return `${msgPrefix}${msgSuffix}`;
};
