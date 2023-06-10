import request from "supertest";
import { app } from "../../app";
import { StatusCode } from "@tverkon-ticketing/common";

it("cookie is removed when logging out", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "password" })
    .expect(StatusCode.Created);
  const response = await request(app).post("/api/users/signout").send({}).expect(StatusCode.OK);

  expect(response.get("Set-Cookie")[0]).toEqual("session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly");
});
