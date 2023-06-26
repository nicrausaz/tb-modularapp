import { NextFunction, Request, Response } from 'express'
import { UserService } from '../services'
import logger from '../libs/logger'
import { BadRequestError, NotFoundError } from '../middlewares/HTTPError'
import { validationResult } from 'express-validator'
import { UploadedFile } from 'express-fileupload'

export default class UserController {
  constructor(private userService: UserService) {}

  /**
   * GET
   * Get all users
   */
  index = async (req: Request, res: Response) => {
    const users = await this.userService.getUsers()
    res.send(users)
  }

  /**
   * GET
   * Get a user by its id
   */
  user = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id)
    const user = await this.userService.getUser(id)

    if (!user) {
      logger.warn(`User with id ${id} not found`)
      return next(new NotFoundError('User not found'))
    }
    res.send(user)
  }

  /**
   * POST
   * Create a new user
   */
  create = async (req: Request, res: Response) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() })
    }

    await this.userService.createUser(req.body)
    res.status(201).send()
  }

  /**
   * PATCH
   * Update an existing user
   */
  update = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id)
    const user = await this.userService.getUser(id)

    if (!user) {
      logger.warn(`User with id ${id} not found`)
      return next(new NotFoundError('User not found'))
    }

    await this.userService.updateUser(id, req.body)
    res.status(201).send()
  }

  /**
   * PUT
   * Add or replace an user's picture
   */
  updatePicture = (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id)

    if (!req.files || Object.keys(req.files).length === 0) {
      throw new BadRequestError('No files were uploaded')
    }

    const picture = req.files.picture as UploadedFile
    const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml']

    if (!allowedMimeTypes.includes(picture.mimetype)) {
      throw new BadRequestError('Invalid file type')
    }
  }

  /**
   * DELETE
   * Delete an existing user
   */
  delete = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id)

    this.userService
      .deleteUser(id)
      .then(() => res.status(204).send())
      .catch((err) => {
        logger.error(err)
        next(err)
      })
  }
}
