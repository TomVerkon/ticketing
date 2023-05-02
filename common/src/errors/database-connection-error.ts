import { CustomError, ErrorMessages } from './custom-error';

export class DatabaseConnectionError extends CustomError {
  statusCode = 500;
  private reason = 'Error connecting to database';

  constructor() {
    super('db connection problems');
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors(): ErrorMessages {
    return [{ message: this.reason }];
  }
}
