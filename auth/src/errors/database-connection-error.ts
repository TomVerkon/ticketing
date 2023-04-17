import { CustomError, ErrorMessageRA } from './custom-error';

export class DatabaseConnectionError extends CustomError {
  statusCode = 500;
  private reason = 'Error connecting to database';

  constructor() {
    super('db connection problems');
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors(): ErrorMessageRA {
    return [{ message: this.reason }];
  }
}
