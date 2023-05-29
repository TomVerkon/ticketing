import express, { Request, Response } from "express";
import { requireAuth, validateRequest, NotFoundError, OrderStatus, BadRequestError } from "@tverkon-ticketing/common";
import { body } from "express-validator";
import mongoose from "mongoose";
import { Ticket } from "../model/ticket";
import { Order } from "../model/order";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("A valid ticketId must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    const userId = req.currentUser!.id;

    // find the ticket the user is trying to order
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new BadRequestError(`Ticket does not exist`);
    }

    if (await ticket.isReserved()) {
      throw new BadRequestError("Ticket is already reserved");
    }

    // calculate an expiration date for this order
    let expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // build the order and save it to the database
    const order = Order.build({
      userId,
      status: OrderStatus.Created,
      expiresAt,
      ticket,
    });
    await order.save();

    // publish an event saying an order was created
    const orderCreatedEvent = {
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      version: order.version,
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    };
    // console.log('publishing OrderCreatedEvent: ', orderCreatedEvent);
    new OrderCreatedPublisher(natsWrapper.client).publish(orderCreatedEvent);

    return res.status(201).send(order);
  }
);

export { router as createOrderRouter };
