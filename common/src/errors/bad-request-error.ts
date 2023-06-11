import { CustomError, ErrorMessages } from './custom-error'
import { StatusCode } from './status-codes'

/** BadRequestError = 400 */
export class BadRequestError extends CustomError {
  statusCode = StatusCode.BadRequestError

  constructor(public message: string, public field?: string) {
    super(message)
    Object.setPrototypeOf(this, BadRequestError.prototype)
  }

  serializeErrors(): ErrorMessages {
    return [{ message: this.message, field: this.field }]
  }
}
