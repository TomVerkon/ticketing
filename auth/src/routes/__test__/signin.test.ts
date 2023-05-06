import request from "supertest";
import { app } from "../../app";
import { response } from "express";

it("fails when an email that does not exist is supplied", async () => {
  const response = await request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com", password: "password" })
    .expect(400);
  // console.log(global.createMsg(expect.getState().currentTestName, "400", response));
});

it("fails when an incorrect password is supplied", async () => {
  // signup using email: "test@test.com", password: "password"
  await request(app).post("/api/users/signup").send({ email: "test@test.com", password: "password" }).expect(201);
  // signin using email: "test@test.com", password: "lkjahflkdsjh"
  const response = await request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com", password: "lkjahflkdsjh" })
    .expect(400);
  // console.log(global.createMsg(expect.getState().currentTestName, "400", response));
});

it("respondes with a cookie when an current logged in user is supplied", async () => {
  // signup using email: "test@test.com", password: "password"
  await request(app).post("/api/users/signup").send({ email: "test@test.com", password: "password" }).expect(201);
  // signin using email: "test@test.com", password: "password"
  const response = await request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com", password: "password" })
    .expect(201);
  expect(response.get("Set-Cookie")).toBeDefined();
  // console.log(global.createMsg(expect.getState().currentTestName, "Set-Cookie", response));
});
