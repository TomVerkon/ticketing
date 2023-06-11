import express, { Request, Response } from 'express'
import { NotFoundError, requireAuth, ForbiddenError } from '@tverkon-ticketing/common'
import { Order } from '../model/order'

const router = express.Router()

router.get('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.orderId).populate('ticket')
  if (!order) {
    throw new NotFoundError()
  }
  if (order.userId !== req.currentUser.id) {
    throw new ForbiddenError()
  }
  return res.send(order)
})

export { router as showOrderRouter }
