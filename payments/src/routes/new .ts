import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  OrderStatus,
  StatusCode,
} from '@tverkon-ticketing/common';
import { Order } from '../model/order';
import { stripe } from '../stripe';
import { Payment } from '../model/payment';
import { PaymentCreatedPublisher } from '../events/publisher/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/payments',
  requireAuth,
  [
    body('token').not().isEmpty().withMessage('Token is required'),
    body('orderId').not().isEmpty().withMessage('OrderId is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId, token } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser.id) {
      throw new ForbiddenError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Order has been cancelled');
    }

    const charge = await stripe.charges.create({
      amount: order.price * 100,
      currency: 'usd',
      source: token,
    });

    const payment = Payment.build({
      orderId: order.id,
      paymentId: charge.id,
    });

    const paymentRecord = await payment.save();

    await new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: paymentRecord.id,
      orderId: payment.orderId,
      stripeId: payment.id,
    });

    res.status(StatusCode.Created).send({ id: payment.id });
  }
);

export { router as createChargeRouter };
