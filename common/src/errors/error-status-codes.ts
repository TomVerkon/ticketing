export enum ErrorStatusCode {
  BadRequestErrorStatusCode = 400,
  RequestValidationErrorStatusCode = 400,
  NotAuthorizedErrorStatusCode = 401, // Unauthenticated
  ForbiddenErrorStatusCode = 403, // Unauthorized
  NotFoundErrorStatusCode = 404,
  DatabaseConnectionErrorStatusCode = 500,
}
