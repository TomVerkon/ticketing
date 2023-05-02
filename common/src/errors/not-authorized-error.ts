import { CustomError, ErrorMessages } from './custom-error';

export class NotAuthorizedError extends CustomError {
  statusCode = 401;
  private static reason = 'Not Authorized';

  constructor() {
    super(NotAuthorizedError.reason);
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors(): ErrorMessages {
    return [{ message: NotAuthorizedError.reason }];
  }
}
