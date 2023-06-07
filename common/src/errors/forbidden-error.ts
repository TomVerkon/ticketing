import { CustomError, ErrorMessages } from './custom-error';
import { ErrorStatusCode } from './error-status-codes';

/** ForbiddenErrorStatusCode = 403 */
export class ForbiddenError extends CustomError {
  statusCode = ErrorStatusCode.ForbiddenErrorStatusCode;

  constructor() {
    super('Forbidden');
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }

  serializeErrors(): ErrorMessages {
    return [{ message: super.message }];
  }
}
