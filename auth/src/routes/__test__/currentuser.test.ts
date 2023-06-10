import request from "supertest";
import { app } from "../../app";
import { StatusCode } from "@tverkon-ticketing/common";

it("responds with details about the current user", async () => {
  const cookie = await global.signup();
  const expected = "test@test.com";
  const response = await request(app).get("/api/users/currentuser").set("Cookie", cookie).send().expect(StatusCode.OK);
  expect(response.body.currentUser.email).toEqual(expected);
  // console.log(global.createMsg(expect, expected, response.body.currentUser.email, response.text));
});

it("responds with null if not authenticated", async () => {
  const response = await request(app).get("/api/users/currentuser").send().expect(StatusCode.OK);
  expect(response.body.currentUser).toEqual(null);
  const actual = response.body.currentUser ? response.body.currentUser : "null";
  // console.log(global.createMsg(expect, "null", actual, response.text));
});
