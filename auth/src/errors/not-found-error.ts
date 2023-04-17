import { CustomError, ErrorMessageRA } from './custom-error';

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor() {
    super('route not found');
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors(): ErrorMessageRA {
    return [{ message: 'Route Not Found' }];
  }
}
