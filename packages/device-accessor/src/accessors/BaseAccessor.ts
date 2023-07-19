import { Module } from '@yalk/module'

/**
 * Define the base accessor class.
 * An accessor is a class that can send and receive data
 * from a defined protocol or device.
 */
export default abstract class BaseAccessor {
  private registeredModules: Array<{ id: string; module: Module }> = []

  protected constructor(private readonly typeKey: string) {}

  /**
   * Aquire the access to the accessor from a module
   * @param module module that require the accessor
   * @param moduleId module id that require the accessor
   */
  public require(module: Module, moduleId: string): void {
    this.registeredModules.push({
      id: moduleId,
      module,
    })
  }

  /**
   * Release the access to the accessor from a module
   * @param moduleId module id that release the accessor
   */
  public release(moduleId: string): void {
    this.registeredModules = this.registeredModules.filter((m) => m.id !== moduleId)
  }

  /**
   * Check is a module has access to the accessor
   * @param moduleId module id to check
   * @returns true if the module has access to the accessor, false otherwise
   */
  public hasAccess(moduleId: string): boolean {
    return this.registeredModules.some((m) => m.id === moduleId)
  }

  /**
   * Send data using the accessor's protocol
   * @param moduleId id of the sender module
   * @param data data to send
   */
  public abstract send(moduleId: string, data: unknown): void

  /**
   * Run the accessor
   */
  public abstract run(): void

  /**
   * Stop the accessor
   */
  public abstract stop(): void

  /**
   * Get the accessor type key
   */
  get type(): string {
    return this.typeKey
  }

  /**
   * Send data to all registered modules
   * @param data data to send
   */
  public transmitToAll(data: unknown): void {
    this.registeredModules.forEach((entry) => {
      entry.module.receiveData(this.typeKey, data)
    })
  }

  /**
   * Send data to a specific module
   * @param moduleId module id to send data to
   * @param data data to send
   */
  public transmitTo(moduleId: string, data: unknown): void {
    const entry = this.registeredModules.find((m) => m.id === moduleId)
    if (entry) {
      entry.module.receiveData(this.type, data)
    }
  }
}
