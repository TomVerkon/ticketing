import { CustomError, ErrorMessages } from './custom-error';
import { DatabaseConnectionErrorStatusCode } from './error-status-codes';

export class DatabaseConnectionError extends CustomError {
  statusCode = DatabaseConnectionErrorStatusCode;
  private reason = 'Error connecting to database';

  constructor() {
    super('db connection problems');
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors(): ErrorMessages {
    return [{ message: this.reason }];
  }
}
