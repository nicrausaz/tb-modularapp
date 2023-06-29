import EventEmitter from 'events'

/**
 * Allows to handle live updates for screens visualizations
 */
export default class ScreenLiveUpdater {
  private emitter = new EventEmitter()
  private static readonly UPDATE_STATE_KEY = 'update'
  // private registeredScreens: Map<number, number> = new Map()

  public notifyChange(screenId: number) {
    // if (!this.registeredScreens.has(screenId)) {
    //   return
    // }
    // Notifiy a change to all subscribers
    console.log('notifyChange', screenId)
    this.emitter.emit(screenId.toString())
  }

  /**
   *
   * @param screenId
   * @param callback
   */
  public subscribe(screenId: number, callback: () => void) {
    // const count = this.registeredScreens.get(screenId)
    // if (!count) {
    //   this.registeredScreens.set(screenId, 1)
    // } else {
    //   this.registeredScreens.set(screenId, count + 1)
    // }

    console.log('subscribe', screenId)
    this.emitter.on(screenId.toString(), callback)
  }

  public unsubscribe(screenId: number, callback: () => void) {
    // if (!this.registeredScreens.has(screenId)) {
    //   return
    // }
    console.log('unsubscribe', screenId)
    this.emitter.off(screenId.toString(), callback)
  }
}
