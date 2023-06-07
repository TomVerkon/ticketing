import { CustomError, ErrorMessages } from './custom-error';
import { NotAuthorizedErrorStatusCode } from './error-status-codes';

export class NotAuthorizedError extends CustomError {
  statusCode = NotAuthorizedErrorStatusCode;
  private static reason = 'Not Authenticated';

  constructor() {
    super(NotAuthorizedError.reason);
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors(): ErrorMessages {
    return [{ message: NotAuthorizedError.reason }];
  }
}
