import { NextFunction, Request, Response } from 'express'
import { UserService } from '../services'
import logger from '../libs/logger'
import { UnauthorizedError } from '../middlewares/HTTPError'

export default class AuthController {
  constructor(private userService: UserService) {}

  /**
   * POST
   * Get an authentification token for a user
   */
  login = async (req: Request, res: Response, next: NextFunction) => {
    const token = await this.userService.authenticateUser(req.body)
    if (!token) {
      logger.warn('Authentication failed for user %s', req.body.username)
      next(new UnauthorizedError('Invalid credentials'))
      return
    }

    res.send({
      token: token,
    })
  }

  /**
   * POST
   * Logout a user
   */
  logout = (req: Request, res: Response) => {
    res.send('logout')
  }

  /**
   * GET
   * Get the current user information
   */
  me = (req: Request, res: Response) => {
    res.send(req.user)
  }
}
