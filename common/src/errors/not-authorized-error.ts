import { CustomError, ErrorMessages } from './custom-error';
import { StatusCode } from './status-codes';

/** NotAuthorizedError = 401 */
export class NotAuthorizedError extends CustomError {
  statusCode = StatusCode.NotAuthorizedError;

  constructor() {
    super('Not Authenticated');
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors(): ErrorMessages {
    return [{ message: super.message }];
  }
}
