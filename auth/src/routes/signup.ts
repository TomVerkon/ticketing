import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').trim().isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 8, max: 20 })
      .withMessage('Pwd must be between 8 and 20 chars inclusive'),
  ],
  (req: Request, res: Response) => {
    //console.log('In signup router');
    const errors = validationResult(req);
    //console.log('validated input');
    if (!errors.isEmpty()) {
      //console.log('Throwing RequestValidationError');
      throw new RequestValidationError(errors.array());
    }
    const { email, password } = req.body;
    throw new DatabaseConnectionError();
    console.log('creating a user');
    res.send({});
  }
);

export { router as signupRouter };
