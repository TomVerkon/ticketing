import { CustomError, ErrorMessages } from './custom-error';
import { BadRequestErrorStatusCode } from './error-status-codes';

export class BadRequestError extends CustomError {
  statusCode = BadRequestErrorStatusCode;

  constructor(public message: string, public field?: string) {
    super(message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors(): ErrorMessages {
    return [{ message: this.message, field: this.field }];
  }
}
