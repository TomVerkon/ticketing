import { NotFoundError, ForbiddenError, OrderStatus, requireAuth } from "@tverkon-ticketing/common";
import express, { Request, Response } from "express";
import { Order } from "../model/order";

const router = express.Router();

router.patch("/api/orders/:orderId", requireAuth, async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.orderId).populate("ticket");
  if (!order) {
    throw new NotFoundError();
  }
  if (order.userId !== req.currentUser.id) {
    throw new ForbiddenError();
  }
  order.status = OrderStatus.Cancelled;
  const updatedOrder = order.save();

  // publish an event saying an order was cancelled
  return res.status(204).send();
});

export { router as patchOrderRouter };
