import { NextFunction, Request, Response } from 'express'
import { BoxService } from '../services'
import { join } from 'path'
import { NotFoundError } from '../middlewares/HTTPError'
import { existsSync } from 'fs'

export default class BoxController {
  constructor(private boxService: BoxService) {}

  index = async (req: Request, res: Response) => {
    res.send(await this.boxService.getBox())
  }

  update = async (req: Request, res: Response) => {
    // TODO: update the box values
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
}
