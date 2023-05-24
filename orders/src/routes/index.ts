import express, { Request, Response } from "express";
import { requireAuth } from "@tverkon-ticketing/common";
// import { NotFoundError } from "@tverkon-ticketing/common";
import { Order } from "../model/order";

const router = express.Router();

router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({ userId: req.currentUser.id }).populate("ticket");
  // if (!orders || orders.length === 0) {
  //   throw new NotFoundError();
  // }
  return res.send(orders);
});

export { router as indexOrderRouter };
