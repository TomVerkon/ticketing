import express, { Request, Response } from 'express';
import { NotFoundError } from '@tverkon-ticketing/common';
import { Ticket } from '../model/ticket';

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    throw new NotFoundError();
  }
  return res.send(ticket);
});

export { router as showTicketRouter };
