import { Request, Response } from 'express'
import { BoxService } from '../services'
import path, { join } from 'path'
import { NotFoundError } from '../middlewares/HTTPError'

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
  staticFile = (req: Request, res: Response) => {
    const filename = req.params.filename
    const file = join(process.env.PUBLIC_DIR || '', filename)

    if (file) {
      res.sendFile(file)
    } else {
      throw new NotFoundError('The specified file does not exist')
    }
  }
}
