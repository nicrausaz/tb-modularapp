import { Request, Response } from 'express'
import { ScreenService } from '../services'
import { NotFoundError } from '../middlewares/HTTPError'

export default class ScreenController {
  constructor(private screenService: ScreenService) {}

  /**
   * GET
   * Get all screens
   */
  index = async (req: Request, res: Response) => {
    res.send(await this.screenService.getScreens())
  }

  /**
   * GET
   * Get a screen by its id
   */
  screen = async (req: Request, res: Response) => {
    const id = req.params.id
    const screen = await this.screenService.getScreen(Number(id))

    if (!screen || !screen.enabled) {
      throw new NotFoundError('Screen not found')
    }
    res.send(screen)
  }

  /**
   * PUT
   * Create or update a screen
   */
  createOrUpdate = async (req: Request, res: Response) => {
    const screen = req.body
    await this.screenService.createOrUpdateScreen(screen)
    res.status(204).send()
  }

  delete = async (req: Request, res: Response) => {
    const id = req.params.id
    await this.screenService.deleteScreen(Number(id))
    res.status(204).send()
  }
}
