import { Request, Response } from 'express'
import { BoxService } from '../services'
import { join } from 'path'

export default class BoxController {
  constructor(private boxService: BoxService) {}

  index = async (req: Request, res: Response) => {
    res.send(await this.boxService.getBox())
  }

  update = async (req: Request, res: Response) => {
    // TODO: update the box values
  }

  staticFile = (req: Request, res: Response) => {
    const filename = req.params.filename
    const file = join(process.env.PUBLIC_DIR || '', filename)

    if (file) {
      res.sendFile(file)
    } else {
      res.status(404).send({
        message: 'File not found',
      })
    }
  }
}