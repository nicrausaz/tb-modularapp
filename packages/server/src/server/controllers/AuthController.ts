import { Request, Response } from 'express'
import { UserService } from '../services'

export default class AuthController {
  constructor(private userService: UserService) {}

  /**
   * POST
   * Get an authentification token for a user
   */
  login = (req: Request, res: Response) => {
    res.send(this.userService.authenticateUser(req.body))
  }

  logout = (req: Request, res: Response) => {
    res.send("logout")
  }
}
