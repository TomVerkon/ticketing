import express, { Request, Response } from "express";
// import { NotFoundError } from "@tverkon-ticketing/common";
// import { Order } from "../model/order";

const router = express.Router();

router.get("/api/orders/:orderId", async (req: Request, res: Response) => {
  // const orders = await Order.find({});
  // if (!orders || orders.length === 0) {
  //   throw new NotFoundError();
  // }
  return res.send({});
});

export { router as showOrderRouter };
