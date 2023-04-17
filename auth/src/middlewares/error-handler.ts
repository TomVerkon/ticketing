import { NextFunction, Request, Response } from 'express';
import { RequestValidationError } from '../errors/request-validation-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //console.log('In Error Handler');
  if (err instanceof RequestValidationError) {
    //console.log('Error is RequestValidationError');
    const formattedErrors = err.errors.map((error) => {
      if (error.type === 'field') {
        //console.log('error.type === field');
        return { message: error.msg, field: error.path };
      }
    });
    res.status(400).send({ errors: formattedErrors });
  } else if (err instanceof DatabaseConnectionError) {
    console.log('Handling a DatabaseConnectionError');
    res.status(400).send({ message: err.reason });
  } else {
    return { message: 'Unknown error occured' };
  }
};
