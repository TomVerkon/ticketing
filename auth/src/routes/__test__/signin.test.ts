import request from "supertest";
import { app } from "../../app";
import { StatusCode } from "@tverkon-ticketing/common";

let waitMicroseconds = 20000;

it(
  "fails with a StatusCode.BadRequestError when supplied email does not exist",
  async () => {
    const response = await request(app)
      .post("/api/users/signin")
      .send({ email: "test@test.com", password: "password" })
      .expect(StatusCode.BadRequestError);
  },
  waitMicroseconds
);

it(
  "fails with a StatusCode.BadRequestError when an incorrect password is supplied",
  async () => {
    // signup using email: "test@test.com", password: "password"
    await request(app)
      .post("/api/users/signup")
      .send({ email: "test@test.com", password: "password" })
      .expect(StatusCode.Created);
    // signin using email: "test@test.com", password: "lkjahflkdsjh"
    const response = await request(app)
      .post("/api/users/signin")
      .send({ email: "test@test.com", password: "lkjahflkdsjh" })
      .expect(StatusCode.BadRequestError);
  },
  waitMicroseconds
);

it(
  "respondes with a cookie when an current logged in user is supplied",
  async () => {
    // signup using email: "test@test.com", password: "password"
    await request(app)
      .post("/api/users/signup")
      .send({ email: "test@test.com", password: "password" })
      .expect(StatusCode.Created);
    // signin using email: "test@test.com", password: "password"
    const response = await request(app)
      .post("/api/users/signin")
      .send({ email: "test@test.com", password: "password" })
      .expect(StatusCode.OK);
    expect(response.get("Set-Cookie")).toBeDefined();
  },
  waitMicroseconds
);
