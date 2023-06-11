import { body } from 'express-validator'
import express, { Request, Response } from 'express'
import { validateRequest, requireAuth } from '@tverkon-ticketing/common'
import { Ticket } from '../model/ticket'
import { natsWrapper } from '../nats-wrapper'
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher'

const router = express.Router()

// create a new ticket
router.post(
  '/api/tickets',
  requireAuth,
  [
    body('title').trim().not().isEmpty().withMessage('Title is required'),
    body('price').trim().isFloat({ gt: 0 }).withMessage('Price must be greater than 0')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body

    const ticket = Ticket.build({ title, price, userId: req.currentUser.id })

    await ticket.save()
    // console.log(`tickets new route saved: ${ticket}`);

    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version
    })

    res.status(201).send(ticket)
  }
)

export { router as createTicketRouter }
