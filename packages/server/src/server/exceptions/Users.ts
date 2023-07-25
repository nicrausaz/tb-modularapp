import logger from '../libs/logger'
import { BadRequestError, ForbiddenError, NotFoundError } from '../middlewares/HTTPError'

/**
 * Error thrown when a user is not found.
 */
export class UserNotFoundException extends NotFoundError {
  constructor(id: number) {
    super(`User with id ${id} not found`)
    logger.warn(`User with id ${id} not found`)
  }
}

/**
 * Error thrown when a username is already taken.
 */
export class UserAlreadyExistsException extends BadRequestError {
  constructor(username: string) {
    super(`User with username ${username} already exists`)
    logger.warn(`User with username ${username} already exists`)
  }
}

/**
 * Error thrown when a user login failed.
 */
export class UserAuthentificationFailedException extends ForbiddenError {
  constructor(username: string) {
    super(`User authentification failed, invalid credentials`)
    logger.warn(`User authentification failed for user ${username}`)
  }
}

/**
 * Error thrown when a user deletion is not allowed.
 * Generally, the default user cannot be deleted.
 */
export class UserDeletionNotAllowedException extends ForbiddenError {
  constructor(id: number) {
    super(`User deletion not allowed for user ${id}`)
    logger.warn(`User deletion not allowed for user ${id}`)
  }
}

/**
 * Error thrown when a user avatar upload failed.
 */
export class UserUploadAvatarException extends BadRequestError {
  constructor(id: number) {
    super(`User avatar upload failed for user ${id}`)
    logger.warn(`User avatar upload failed for user ${id}`)
  }
}
