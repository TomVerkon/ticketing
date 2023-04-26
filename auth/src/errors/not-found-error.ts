import { CustomError, ErrorMessages } from './custom-error';

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor() {
    super('route not found');
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors(): ErrorMessages {
    return [{ message: 'Route Not Found' }];
  }
}
