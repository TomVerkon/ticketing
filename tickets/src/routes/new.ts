import { currentUser, requireAuth } from "@tverkon-ticketing/common";
import { body } from "express-validator";
import express, { Request, Response } from "express";
import { validateRequest, BadRequestError } from "@tverkon-ticketing/common";

const router = express.Router();

// create a new ticket
router.post(
  "/api/tickets",
  requireAuth,
  [body("title").trim().not().isEmpty().withMessage("Title is required"), body("price").trim().isFloat({ gt: 0 }).withMessage("Price must be greater than 0")],
  validateRequest,

  (req: Request, res: Response) => {
    res.sendStatus(200);
  }
);

export { router as createTicketRouter };
