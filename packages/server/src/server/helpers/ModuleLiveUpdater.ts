import EventEmitter from 'events'
import logger from '../libs/logger'

/**
 * Allows to handle live updates for modules
 */
export default class ModuleLiveUpdater {
  private emitter = new EventEmitter()

  /**
   * Notify a screen update
   * @param moduleId the screen id to notify
   */
  public notifyChange(moduleId: string) {
    this.emitter.emit(moduleId)
  }

  /**
   * Subscribe to screen updates
   * @param moduleId the screen id
   * @param callback the callback to call when the screen is updated
   */
  public subscribe(moduleId: string, callback: (render: string) => void) {
    this.emitter.on(moduleId.toString(), callback)
    logger.info(`LiveUpdater: Subscribed to module ${moduleId}, ${this.emitter.listenerCount(moduleId.toString())} listeners`)
  }

  /**
   * Unsubscribe from screen updates
   * @param moduleId the screen id
   * @param callback the callback to remove from the listeners
   */
  public unsubscribe(moduleId: string, callback: (render: string) => void) {
    this.emitter.off(moduleId.toString(), callback)
    logger.info(
      `LiveUpdater: Unsubscribed from module ${moduleId}, ${this.emitter.listenerCount(moduleId.toString())} listeners left`,
    )
  }

  public clearModule(moduleId: string) {
    this.emitter.removeAllListeners(moduleId.toString())
    logger.info(`LiveUpdater: Cleared module ${moduleId}`)
  }
}
