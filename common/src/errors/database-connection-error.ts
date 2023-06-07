import { CustomError, ErrorMessages } from './custom-error';
import { ErrorStatusCode } from './error-status-codes';

/** DatabaseConnectionErrorStatusCode = 500 */
export class DatabaseConnectionError extends CustomError {
  statusCode = ErrorStatusCode.DatabaseConnectionErrorStatusCode;

  constructor() {
    super('Error connecting to database');
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors(): ErrorMessages {
    return [{ message: super.message }];
  }
}
