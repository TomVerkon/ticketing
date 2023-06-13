import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  OrderStatus,
} from '@tverkon-ticketing/common';
import { Order } from '../model/order';

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

    res.send({ success: true });
  }
);

export { router as createChargeRouter };
