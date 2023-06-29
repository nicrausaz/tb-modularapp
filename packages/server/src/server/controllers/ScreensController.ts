import { NextFunction, Request, Response } from 'express'
import { ScreensService } from '../services'
import ScreenLiveUpdater from '../helpers/ScreenLiveUpdater'

/**
 * Controller for the screens routes
 */
export default class ScreensController {
  constructor(private screensService: ScreensService, private screenUpdater: ScreenLiveUpdater) {}

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
   * GET
   * Get a screen by its id if it exists and is enabled
   * Register to a screen's events & render trough SSE
   * to allow the screen to be updated in real time
   */
  screenEvents = async (req: Request, res: Response, next: NextFunction) => {
    const screenId = Number(req.params.id)
    const screen = await this.screensService.getScreen(screenId).catch(next)

    // Configure the SSE response headers
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    const handleScreenEvent = async () => {
      const screen = await this.screensService.getScreen(screenId).catch(next)

      res.write(`data: ${JSON.stringify(screen)}\n\n`)
    }

    this.screenUpdater.subscribe(screenId, handleScreenEvent)

    // res.write(`data: ${JSON.stringify(screen)}\n\n`)
    res.write(`data: ${JSON.stringify(screen)}\n\n`)

    // Unsubscribe from the screen events when the client disconnects
    req.on('close', () => {
      this.screenUpdater.unsubscribe(screenId, handleScreenEvent)
    })
  }

  /**
   * PUT
   * Create or update a screen
   */
  createOrUpdate = (req: Request, res: Response, next: NextFunction) => {
    this.screensService
      .createOrUpdateScreen(req.body)
      .then(() => {
        this.screenUpdater.notifyChange(req.body.id)
        res.status(204).send()
      })
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
