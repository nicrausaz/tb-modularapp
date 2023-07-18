import EventEmitter from 'events'
import logger from '../libs/logger'

/**
 * Allows to handle live updates for screens visualizations
 */
export default class ScreenLiveUpdater {
  private emitter = new EventEmitter().setMaxListeners(50)

  /**
   * Notify a screen update
   * @param screenId the screen id to notify
   */
  public notifyChange(screenId: number) {
    this.emitter.emit(screenId.toString())
  }

  /**
   * Subscribe to screen updates
   * @param screenId the screen id
   * @param callback the callback to call when the screen is updated
   */
  public subscribe(screenId: number, callback: () => void) {
    this.emitter.on(screenId.toString(), callback)
    logger.info(`Subscribed to screen ${screenId}, ${this.emitter.listenerCount(screenId.toString())} listeners`)
  }

  /**
   * Unsubscribe from screen updates
   * @param screenId the screen id
   * @param callback the callback to remove from the listeners
   */
  public unsubscribe(screenId: number, callback: () => void) {
    this.emitter.off(screenId.toString(), callback)
    logger.info(
      `Unsubscribed from screen ${screenId}, ${this.emitter.listenerCount(screenId.toString())} listeners left`,
    )
  }
}
