import { NextFunction, Request, Response } from 'express'
import { BoxService } from '../services'
import { join } from 'path'
import { BadRequestError, NotFoundError } from '../middlewares/HTTPError'
import { existsSync } from 'fs'
import { UploadedFile } from 'express-fileupload'

export default class BoxController {
  constructor(private boxService: BoxService) {}

  index = async (req: Request, res: Response) => {
    res.send(await this.boxService.getBox())
  }

  update = async (req: Request, res: Response) => {
    this.boxService.updateBox(req.body)
    res.status(204).send()
  }

  updateIcon = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return next(new BadRequestError('No files were uploaded'))
    }

    const icon = req.files.file as UploadedFile
    const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml']

    if (!allowedMimeTypes.includes(icon.mimetype)) {
      return next(new BadRequestError('Invalid file type'))
    }

    await this.boxService.updateIcon(icon)

    res.send({
      message: 'Icon updated successfully',
      filename: icon.name,
    })
  }

  /**
   * Serve a static file from the public directory
   */
  staticFile = (req: Request, res: Response, next: NextFunction) => {
    const filename = req.params.filename
    const file = join(process.env.PUBLIC_DIR || '', filename)

    if (existsSync(file)) {
      res.sendFile(file)
    } else {
      next(new NotFoundError('The specified file does not exist'))
    }
  }

  /**
   * Serve a static file from a module directory
   */
  moduleStaticFile = (req: Request, res: Response, next: NextFunction) => {
    const moduleId = req.params.moduleId
    const filename = req.params.filename
    const file = join(process.env.MODULES_DIR || '', moduleId, filename)

    if (existsSync(file)) {
      res.sendFile(file)
    } else {
      next(new NotFoundError('The specified file does not exist'))
    }
  }

  /**
   * Serve a static file from a user directory
   */
  userStaticFile = (req: Request, res: Response) => {
    const filename = req.params.filename
    const file = join(process.env.PUBLIC_DIR + '/users' || '', filename)

    if (existsSync(file)) {
      res.sendFile(file)
    } else {
      throw new NotFoundError('The specified file does not exist')
    }
  }

  APIKeys = async (req: Request, res: Response) => {
    res.send(await this.boxService.getAPIKeys())
  }

  generateAPIKey = async (req: Request, res: Response) => {
    this.boxService.generateAPIKey(req.body).then((key) =>
      res.send({
        key,
      }),
    )
  }

  deleteAPIKey = async (req: Request, res: Response, next: NextFunction) => {
    this.boxService
      .deleteAPIKey(parseInt(req.params.id))
      .then(() => res.status(204).send())
      .catch(next)
  }
}
