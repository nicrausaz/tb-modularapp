import { NextFunction, Request, Response } from 'express'
import { ScreensService } from '../services'

/**
 * Controller for the screens routes
 */
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
   * Get a screen by its id if it exists and is enabled
   */
  screen = async (req: Request, res: Response, next: NextFunction) => {
    this.screensService
      .getScreen(Number(req.params.id))
      .then((screen) => res.send(screen))
      .catch(next)
  }

  /**
   * PUT
   * Create or update a screen
   */
  createOrUpdate = (req: Request, res: Response, next: NextFunction) => {
    this.screensService
      .createOrUpdateScreen(req.body)
      .then(() => res.status(204).send())
      .catch(next)
  }

  /**
   * DELETE
   * Delete a screen
   */
  delete = (req: Request, res: Response, next: NextFunction) => {
    this.screensService
      .deleteScreen(Number(req.params.id))
      .then(() => res.status(204).send())
      .catch(next)
  }
}
