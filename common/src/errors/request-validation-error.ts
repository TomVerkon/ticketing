import { ValidationError } from 'express-validator';
import { CustomError, ErrorMessages } from './custom-error';
import { StatusCode } from './status-codes';

/** RequestValidationError = 400 */
export class RequestValidationError extends CustomError {
  statusCode = StatusCode.RequestValidationError;

  constructor(public errors: ValidationError[]) {
    super('Invalid request parameters');
    // This next line is only because we are extending a builtin class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors(): ErrorMessages {
    return this.errors.map(error => {
      if (error.type === 'field') {
        return { message: error.msg, field: error.path };
      } else {
        return { message: error.msg };
      }
    });
  }
}
