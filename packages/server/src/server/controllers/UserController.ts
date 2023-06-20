import { NextFunction, Request, Response } from 'express'
import { UserService } from '../services'
import logger from '../libs/logger'
import { NotFoundError } from '../middlewares/HTTPError'

export default class UserController {
  constructor(private userService: UserService) {}

  index = async (req: Request, res: Response) => {
    const users = await this.userService.getUsers()
    res.send(users)
  }

  user = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id)
    const user = await this.userService.getUser(id)

    if (!user) {
      logger.warn(`User with id ${id} not found`)
      return next(new NotFoundError('User not found'))
    }
    res.send(user)
  }

  create = async (req: Request, res: Response) => {
    await this.userService.createUser(req.body)
    res.status(201).send()
  }
}
