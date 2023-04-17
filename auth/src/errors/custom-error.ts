export interface ErrorMessage {
  message: string;
  field?: string;
}

export type ErrorMessageRA = ErrorMessage[];

export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): ErrorMessageRA;
}
