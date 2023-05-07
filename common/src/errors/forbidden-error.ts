import { CustomError, ErrorMessages } from "@tverkon-ticketing/common";

export class ForbiddenError extends CustomError {
  statusCode = 403;
  private static reason = "Forbidden";

  constructor() {
    super(ForbiddenError.reason);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }

  serializeErrors(): ErrorMessages {
    return [{ message: ForbiddenError.reason }];
  }
}
