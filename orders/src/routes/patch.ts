import { NotFoundError, ForbiddenError, OrderStatus, requireAuth } from '@tverkon-ticketing/common'
import express, { Request, Response } from 'express'
import { Order } from '../model/order'
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.patch('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.orderId).populate('ticket')
  if (!order) {
    throw new NotFoundError()
  }
  if (order.userId !== req.currentUser.id) {
    throw new ForbiddenError()
  }
  order.status = OrderStatus.Cancelled
  const updatedOrder = await order.save()

  // publish an event saying an order was cancelled
  await new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    version: order.version,
    ticket: {
      id: order.ticket.id
    }
  })

  return res.status(204).send()
})

export { router as patchOrderRouter }
