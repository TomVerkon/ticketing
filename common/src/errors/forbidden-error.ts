import { CustomError, ErrorMessages } from './custom-error';
import { ForbiddenErrorStatusCode } from './error-status-codes';

export class ForbiddenError extends CustomError {
  statusCode = ForbiddenErrorStatusCode;
  private static reason = 'Forbidden';

  constructor() {
    super(ForbiddenError.reason);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }

  serializeErrors(): ErrorMessages {
    return [{ message: ForbiddenError.reason }];
  }
}
