export enum ErrorStatusCode {
  /** BadRequestErrorStatusCode = 400 */
  BadRequestErrorStatusCode = 400,
  /** RequestValidationErrorStatusCode = 400 */
  RequestValidationErrorStatusCode = 400,
  /** NotAuthorizedErrorStatusCode = 401 */
  NotAuthorizedErrorStatusCode = 401, // Unauthenticated
  /** ForbiddenErrorStatusCode = 403 */
  ForbiddenErrorStatusCode = 403, // Unauthorized
  /** NotFoundErrorStatusCode = 404 */
  NotFoundErrorStatusCode = 404,
  /** DatabaseConnectionErrorStatusCode = 500 */
  DatabaseConnectionErrorStatusCode = 500,
}
