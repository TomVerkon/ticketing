export enum StatusCode {
  /** OK = 200 */
  OK = 200,
  /** Created = 201 */
  Created = 201,
  /** BadRequestError = 400 */
  BadRequestError = 400,
  /** RequestValidationError = 400 */
  RequestValidationError = 400,
  /** NotAuthorizedError = 401 */
  NotAuthorizedError = 401, // Unauthenticated
  /** ForbiddenError = 403 */
  ForbiddenError = 403, // Unauthorized
  /** NotFoundError = 404 */
  NotFoundError = 404,
  /** DatabaseConnectionError = 500 */
  DatabaseConnectionError = 500,
}
