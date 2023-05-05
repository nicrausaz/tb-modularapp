import { Request, Response } from 'express'
import { UserService } from '../services'

export default class AuthController {
  constructor(private userService: UserService) {}

  /**
   * POST
   * Get an authentification token for a user
   */
  login = async (req: Request, res: Response) => {
    const token = await this.userService.authenticateUser(req.body)
    if (!token) {
      res.status(401).send({
        message: 'Invalid credentials',
      })
    } else {
      res.send({
        token: token,
      })
    }
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
