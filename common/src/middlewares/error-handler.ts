import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../errors/custom-error';
import { StatusCode } from '../errors/status-codes';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  console.log('Not a Custom Error:', err);

  return res.status(StatusCode.BadRequestError).send({ errors: [{ message: 'Unknown error occured' }] });
};
