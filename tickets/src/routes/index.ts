import express, { Request, Response } from 'express'
import { NotFoundError } from '@tverkon-ticketing/common'
import { Ticket } from '../model/ticket'

const router = express.Router()

router.get('/api/tickets', async (req: Request, res: Response) => {
  const tickets = await Ticket.find({})
  if (!tickets || tickets.length === 0) {
    throw new NotFoundError()
  }
  return res.send(tickets)
})

export { router as indexTicketRouter }
