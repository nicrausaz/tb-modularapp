import { NextFunction, Request, Response } from 'express'
import { UsersService } from '../services'

/**
 * Controller for the authentification routes
 */
export default class AuthController {
  constructor(private usersService: UsersService) {}

  /**
   * POST
   * Get an authentification token for a user
   */
  login = (req: Request, res: Response, next: NextFunction) => {
    this.usersService
      .authenticateUser(req.body)
      .then((token) => res.send({ token }))
      .catch(next)
  }

  /**
   * GET
   * Get the current user information
   */
  me = (req: Request, res: Response) => {
    res.send(req.user)
  }
}
