import logger from '../libs/logger'
import { ForbiddenError, NotFoundError } from '../middlewares/HTTPError'

/**
 * Error thrown when a screen is not found.
 */
export class ScreenNotFoundException extends NotFoundError {
  constructor(id: number) {
    super(`Screen with id ${id} not found`)
    logger.warn(`Screen with id ${id} not found`)
  }
}

/**
 * Error thrown when a screen is not enabled.
 */
export class ScreenDisabledException extends ForbiddenError {
  constructor(id: number) {
    super(`Screen with id ${id} not enabled`)
    logger.warn(`Screen with id ${id} not enabled`)
  }
}
