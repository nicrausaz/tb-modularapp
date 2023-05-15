import { Request, Response } from 'express'
import { ScreenService } from '../services'

export default class ScreenController {
  constructor(private screenService: ScreenService) {}

  /**
   * GET
   * Get all screens
   */
  index = async (req: Request, res: Response) => {
    res.send(await this.screenService.getScreens())
  }

  screen = async (req: Request, res: Response) => {
    const id = req.params.id
    res.send(await this.screenService.getScreen(Number(id)))
  }

  createOrUpdate = async (req: Request, res: Response) => {
    const screen = req.body
    await this.screenService.createOrUpdateScreen(screen)
    res.send()
  }

  delete = async (req: Request, res: Response) => {
    //
  }

  
}
