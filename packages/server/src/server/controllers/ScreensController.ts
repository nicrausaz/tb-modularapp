import { NextFunction, Request, Response } from 'express'
import { ScreensService } from '../services'
import { ForbiddenError, NotFoundError } from '../middlewares/HTTPError'
import logger from '../libs/logger'

export default class ScreensController {
  constructor(private screensService: ScreensService) {}

  /**
   * GET
   * Get all screens
   */
  index = async (req: Request, res: Response) => {
    res.send(await this.screensService.getScreens())
  }

  /**
   * GET
   * Get a screen by its id
   */
  screen = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    const screen = await this.screensService.getScreen(Number(id))

    if (!screen) {
      logger.warn(`Screen with id ${id} not found`)
      next(new NotFoundError('Screen not found'))
      return
    }

    if (!screen.enabled) {
      logger.warn(`Screen with id ${id} not enabled`)
      next(new ForbiddenError('Screen not enabled'))
      return
    }

    res.send(screen)
  }

  /**
   * PUT
   * Create or update a screen
   */
  createOrUpdate = async (req: Request, res: Response) => {
    const screen = req.body
    const screenId = await this.screensService.createOrUpdateScreen(screen)

    res.status(200).send({
      message: 'Screen updated successfully',
      screenId,
    })
  }

  /**
   * DELETE
   * Delete a screen
   */
  delete = async (req: Request, res: Response) => {
    const id = req.params.id
    await this.screensService.deleteScreen(Number(id))
    res.status(204).send()
  }
}
