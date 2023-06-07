import { ErrorStatusCode } from './status-codes';

export interface ErrorMessage {
  message: string;
  field?: string;
}

export type ErrorMessages = ErrorMessage[];

export abstract class CustomError extends Error {
  abstract statusCode: ErrorStatusCode;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): ErrorMessages;
}
