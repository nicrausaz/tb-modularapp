import { NextFunction, Request, Response } from 'express'
import { UsersService } from '../services'
import logger from '../libs/logger'
import { UnauthorizedError } from '../middlewares/HTTPError'

/**
 * Controller for the authentification routes
 */
export default class AuthController {
  constructor(private usersService: UsersService) {}

  /**
   * POST
   * Get an authentification token for a user
   */
  login = async (req: Request, res: Response, next: NextFunction) => {
    const token = await this.usersService.authenticateUser(req.body)
    if (!token) {
      logger.warn('Authentication failed for user %s', req.body.username)
      return next(new UnauthorizedError('Invalid credentials'))
    }

    res.send({
      token: token,
    })
  }

  /**
   * GET
   * Get the current user information
   */
  me = (req: Request, res: Response) => {
    res.send(req.user)
  }
}
