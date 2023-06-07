import { CustomError, ErrorMessages } from './custom-error';
import { ErrorStatusCode } from './error-status-codes';

export class NotAuthorizedError extends CustomError {
  statusCode = ErrorStatusCode.NotAuthorizedErrorStatusCode;

  constructor() {
    super('Not Authenticated');
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors(): ErrorMessages {
    return [{ message: super.message }];
  }
}
