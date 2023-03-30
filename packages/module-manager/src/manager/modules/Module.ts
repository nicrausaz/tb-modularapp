export default abstract class Module {
  abstract name: string

  abstract description: string

  abstract version: string

  /**
   * Called when the module is registered to the manager
   */
  abstract init(): this

  /**
   * Called when the module is started
   */
  abstract start(): void

  /**
   * Called when the module is stopped
   */
  abstract stop(): void

  /**
   * Returns the module's view
   */
  // abstract render(): any
}
