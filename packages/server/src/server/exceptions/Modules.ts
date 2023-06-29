import logger from '../libs/logger'
import { BadRequestError, ForbiddenError, InternalServerError, NotFoundError } from '../middlewares/HTTPError'

/**
 * Error thrown when a module is not found.
 */
export class ModuleNotFoundException extends NotFoundError {
  constructor(id: string) {
    super(`Module with id ${id} not found`)
    logger.warn(`Module with id ${id} not found`)
  }
}

/**
 * Error thrown when a module has an internal error,
 * such as a runtime error, invalid configuration or structure.
 */
export class ModuleActionException extends InternalServerError {
  constructor(id: string, action: string) {
    super(`Module had an internal error during ${action}`)
    logger.error(`Module with id ${id} had an internal error during ${action}`)
  }
}

/**
 * Error thrown when a module is already in the requested state.
 */
export class ModuleRedundantStatusException extends BadRequestError {
  constructor(id: string, status: string) {
    super(`Module with id ${id} is already ${status}`)
    logger.warn(`Module with id ${id} is already ${status}`)
  }
}

/**
 * Error thrown when a module is disabled, prevent it from being used for an action.
 */
export class ModuleDisabledException extends ForbiddenError {
  constructor(id: string) {
    super(`Module with id ${id} is disabled`)
    logger.warn(`Module with id ${id} is disabled`)
  }
}
