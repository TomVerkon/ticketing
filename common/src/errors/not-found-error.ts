import { CustomError, ErrorMessages } from './custom-error';
import { ErrorStatusCode } from './error-status-codes';

/** NotFoundErrorStatusCode = 404 */
export class NotFoundError extends CustomError {
  statusCode = ErrorStatusCode.NotFoundErrorStatusCode;

  constructor() {
    super('Route not Found');
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors(): ErrorMessages {
    return [{ message: super.message }];
  }
}
