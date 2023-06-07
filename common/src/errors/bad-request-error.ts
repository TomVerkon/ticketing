import { CustomError, ErrorMessages } from './custom-error';
import { ErrorStatusCode } from './error-status-codes';

/** BadRequestErrorStatusCode = 400 */
export class BadRequestError extends CustomError {
  statusCode = ErrorStatusCode.BadRequestErrorStatusCode;

  constructor(public message: string, public field?: string) {
    super(message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors(): ErrorMessages {
    return [{ message: this.message, field: this.field }];
  }
}
