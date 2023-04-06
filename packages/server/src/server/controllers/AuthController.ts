import { Request, Response } from 'express'
import { UserRepository } from '../repositories'

export default class AuthController {
  constructor(private userRepository: UserRepository) {}

  login = (req: Request, res: Response) => {
    res.send(this.userRepository.getById())
  }

  logout = (req: Request, res: Response) => {
    res.send("logout")
  }
}
