import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import request from "supertest";
import { app } from "../app";

declare global {
  var signin: () => string[];
  var createMsg: (title: string, expected: string, response: request.Response, altResponse?: string) => string;
}

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = "asdf";

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
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
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

global.createMsg = (title: string, expected: string, response: request.Response, altResponse?: string): string => {
  let resTxt: string = "";
  let returnedStatus = "200";
  if (!response) {
    resTxt = altResponse;
  } else {
    resTxt = JSON.parse(response.text);
    returnedStatus = response.status.toString();
  }
  return `${title}\nexpected: ${expected}, returned: ${returnedStatus}\n${JSON.stringify(resTxt, null, 2)}`;
};
