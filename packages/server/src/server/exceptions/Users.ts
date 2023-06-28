import logger from '../libs/logger'
import { BadRequestError, ForbiddenError, InternalServerError, NotFoundError } from '../middlewares/HTTPError'

/**
 * Error thrown when a user is not found.
 */
export class UserNotFoundException extends NotFoundError {
  constructor(id: string) {
    super(`User with id ${id} not found`)
    logger.warn(`User with id ${id} not found`)
  }
}
