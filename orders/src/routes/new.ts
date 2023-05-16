import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from "@tverkon-ticketing/common";
import { body } from "express-validator";
// import { NotFoundError } from "@tverkon-ticketing/common";
// import { Order } from "../model/order";

const router = express.Router();

router.post("/api/orders", async (req: Request, res: Response) => {
  // const orders = await Order.find({});
  // if (!orders || orders.length === 0) {
  //   throw new NotFoundError();
  // }
  return res.send({});
});

export { router as createOrderRouter };
