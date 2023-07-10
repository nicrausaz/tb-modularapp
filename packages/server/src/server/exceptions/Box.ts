import logger from "../libs/logger"
import { NotFoundError } from "../middlewares/HTTPError"

/**
 * Error thrown when a API key is not found.
 */
export class APIKeyNotFoundException extends NotFoundError {
  constructor(id: number) {
    super(`API key not found`)
    logger.warn(`API key with id ${id} not found`)
  }
}