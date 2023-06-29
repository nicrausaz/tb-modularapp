import { NextFunction, Request, Response } from 'express'
import { UsersService } from '../services'
import { BadRequestError } from '../middlewares/HTTPError'
import { UploadedFile } from 'express-fileupload'

/**
 * Controller for the users routes
 */
export default class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   * GET
   * Get all users
   */
  index = async (req: Request, res: Response) => {
    res.send(await this.usersService.getUsers())
  }

  /**
   * GET
   * Get a user by its id
   */
  user = async (req: Request, res: Response, next: NextFunction) => {
    this.usersService
      .getUser(parseInt(req.params.id))
      .then((user) => res.send(user))
      .catch(next)
  }

  /**
   * POST
   * Create a new user
   */
  create = async (req: Request, res: Response, next: NextFunction) => {
    this.usersService
      .createUser(req.body)
      .then(() => res.status(204).send())
      .catch(next)
  }

  /**
   * PATCH
   * Update an existing user
   */
  update = async (req: Request, res: Response, next: NextFunction) => {
    this.usersService
      .updateUser(parseInt(req.params.id), req.body)
      .then(() => res.status(204).send())
      .catch(next)
  }

  /**
   * PUT
   * Add or replace an user's picture
   */
  updatePicture = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id)

    if (!req.files || Object.keys(req.files).length === 0) {
      return next(new BadRequestError('No files were uploaded'))
    }

    const picture = req.files.file as UploadedFile
    const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml']

    if (!allowedMimeTypes.includes(picture.mimetype)) {
      return next(new BadRequestError('Invalid file type'))
    }

    this.usersService
      .uploadAvatar(id, picture)
      .then(() => res.status(204).send())
      .catch(next)
  }

  /**
   * DELETE
   * Delete an existing user
   */
  delete = async (req: Request, res: Response, next: NextFunction) => {
    this.usersService
      .deleteUser(parseInt(req.params.id))
      .then(() => res.status(204).send())
      .catch(next)
  }
}
