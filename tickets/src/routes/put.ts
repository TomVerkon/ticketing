import { validateRequest, NotFoundError, requireAuth, ForbiddenError, BadRequestError } from '@tverkon-ticketing/common'
import { body } from 'express-validator'
import express, { Request, Response } from 'express'
import { Ticket } from '../model/ticket'
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

// update an existing ticket
router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').trim().not().isEmpty().withMessage('Title is required'),
    body('price').trim().isFloat({ gt: 0 }).withMessage('Price must be greater than 0')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id)
    // console.log(req.currentUser.id);
    if (!ticket) {
      throw new NotFoundError()
    } else if (ticket.userId !== req.currentUser.id) {
      // console.log(ticket.userId, " !== ", req.currentUser.id);
      throw new ForbiddenError()
    } else if (ticket.orderId !== undefined) {
      throw new BadRequestError('Cannot edit a reserved ticket')
    } else {
      ticket.title = req.body.title
      ticket.price = req.body.price
      await ticket.save()

      await new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version
      })

      res.send(ticket)
    }
  }
)

export { router as putTicketRouter }
