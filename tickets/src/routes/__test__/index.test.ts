import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../model/ticket";

it("can fetch a list of tickets", async () => {
  const titles: string[] = ["asdfghjk", "qwertyui"] as string[];
  const prices: number[] = [20, 25] as number[];
  const userIds: string[] = ["xyzzy", "plough"] as string[];

  for (let i = 0; i < 2; i++) {
    const title = titles[i];
    const price = prices[i];
    const userId = userIds[i];
    const ticket = Ticket.build({ title: titles[i], price: prices[i], userId: userIds[i] });
    await ticket.save();
  }

  const response = await request(app).get(`/api/tickets`).expect(200);
  expect(response.body.length).toStrictEqual(2);
  // console.log(global.createMsg(expect.getState().currentTestName, "200", response));
});
