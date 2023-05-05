import { Request, Response } from 'express'
import { ScreenService } from '../services'

export default class ScreenController {
  constructor(private screenService: ScreenService) {}

  index = async (req: Request, res: Response) => {
    res.send(this.screenService.getScreens())
    //
  }

  screen = async (req: Request, res: Response) => {
    const id = req.params.id
    const screen = await this.screenService.getScreen(id)
  }

  createOrUpdate = async (req: Request, res: Response) => {
    //
  }

  delete = async (req: Request, res: Response) => { 
    //
  }

  
}
