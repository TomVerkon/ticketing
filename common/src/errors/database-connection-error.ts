import { CustomError, ErrorMessages } from './custom-error';
import { StatusCode } from './status-codes';

/** DatabaseConnectionError = 500 */
export class DatabaseConnectionError extends CustomError {
  statusCode = StatusCode.DatabaseConnectionError;

  constructor() {
    super('Error connecting to database');
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors(): ErrorMessages {
    return [{ message: super.message }];
  }
}
