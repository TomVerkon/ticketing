import request from "supertest";
import { app } from "../../app";

it("responds with details about the current user", async () => {
  const cookie = await global.signup();
  const response = await request(app).get("/api/users/currentuser").set("Cookie", cookie).send().expect(200);
  expect(response.body.currentUser.email).toEqual("test@test.com");
  console.log(global.createMsg(expect.getState().currentTestName, "test@test.com", response));
});

it("responds with null if not authenticated", async () => {
  const response = await request(app).get("/api/users/currentuser").send().expect(200);
  expect(response.body.currentUser).toEqual(null);
  console.log(global.createMsg(expect.getState().currentTestName, "null", response));
});
