import { CustomError, ErrorMessages } from './custom-error';
import { StatusCode } from './status-codes';

/** ForbiddenError = 403 */
export class ForbiddenError extends CustomError {
  statusCode = StatusCode.ForbiddenError;

  constructor() {
    super('Forbidden');
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }

  serializeErrors(): ErrorMessages {
    return [{ message: super.message }];
  }
}
