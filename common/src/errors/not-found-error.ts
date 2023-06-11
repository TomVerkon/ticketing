import { CustomError, ErrorMessages } from './custom-error'
import { StatusCode } from './status-codes'

/** NotFoundError = 404 */
export class NotFoundError extends CustomError {
  statusCode = StatusCode.NotFoundError

  constructor() {
    super('Route not Found')
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }

  serializeErrors(): ErrorMessages {
    return [{ message: super.message }]
  }
}
