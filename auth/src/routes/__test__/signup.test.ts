import request from "supertest";
import { app } from "../../app";

it("returns a 201 on successful signup", async () => {
  const response = await request(app).post("/api/users/signup").send({ email: "test@test.com", password: "password" }).expect(201);
  console.log(global.createMsg(expect.getState().currentTestName, "201", response));
});

it("returns a 400 with an invalid email", async () => {
  const response = await request(app).post("/api/users/signup").send({ email: "testtest.com", password: "password" }).expect(400);
  console.log(global.createMsg(expect.getState().currentTestName, "400", response));
});

it("returns a 400 with an invalid password", async () => {
  const response = await request(app).post("/api/users/signup").send({ email: "test@test.com", password: "pass" }).expect(400);
  console.log(global.createMsg(expect.getState().currentTestName, "400", response));
});

it("returns a 400 with missing email", async () => {
  const response = await request(app).post("/api/users/signup").send({ email: null, password: "password" }).expect(400);
  console.log(global.createMsg(expect.getState().currentTestName, "400", response));
});

it("returns a 400 with missing password", async () => {
  const response = await request(app).post("/api/users/signup").send({ email: "test@test.com", password: null }).expect(400);
  console.log(global.createMsg(expect.getState().currentTestName, "400", response));
});

it("return 400, disallows duplicate emails", async () => {
  // signup with email: "test@test.com", password: "password"
  await request(app).post("/api/users/signup").send({ email: "test@test.com", password: "password" }).expect(201);
  const response = await request(app).post("/api/users/signup").send({ email: "test@test.com", password: "password" }).expect(400);
  console.log(global.createMsg(expect.getState().currentTestName, "400", response));
});

it("sets a cookie on the session on successful signup", async () => {
  const response = await request(app).post("/api/users/signup").send({ email: "test@test.com", password: "password" }).expect(201);
  expect(response.get("Set-Cookie")).toBeDefined();
  console.log(global.createMsg(expect.getState().currentTestName, "201", response));
});
