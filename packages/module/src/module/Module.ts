import EventEmitter from 'events'
import { Configuration } from './configuration/Configuration'
import { SpecificConfiguration } from './configuration/SpecificConfiguration'
import ModuleRenderer from './ModuleRenderer'
import { SpecificConfigurationEntryTypeValue } from './configuration/SpecificConfigurationEntry'


export interface ModuleProps {
  [key: string]: unknown
}

export default abstract class Module {
  private readonly emitter = new EventEmitter().setMaxListeners(50)
  private static readonly UPDATE_STATE_KEY = 'update'
  private static readonly SEND_DATA_KEY = 'send'

  public constructor(private readonly _configuration: Configuration, private readonly _renderer?: ModuleRenderer) {}

  /**
   * Initialize the module
   */
  public init(): void {}

  /**
   * Clear the module
   */
  public destroy(): void {
    this.emitter.removeAllListeners()
  }

  /**
   * Start the module
   */
  public abstract start(): void

  /**
   * Stop the module
   */
  public stop(): void {}

  /**
   * Apply configuration changes to the module, only existing fiels will be updated, others will be ignored
   * @param configuration The configuration to apply
   */
  public setConfiguration(configuration: Array<{ name: string; value: SpecificConfigurationEntryTypeValue }>) {
    configuration.forEach((field) => {
      this.currentConfig.updateEntry(field.name, field.value)
    })
    this.onConfigurationChanged()
  }

  /**
   * Reset the module configuration to default
   */
  public resetConfiguration() {
    this._configuration.reset()
  }

  /**
   * Register to the module updates
   * When the module updates, the callback will be called with the new rendered HTML
   */
  public registerToUpdates(callback: (render: string) => void): void {
    this.emitter.on(Module.UPDATE_STATE_KEY, callback)
    this.onNewSubscriber()
  }

  /**
   * Unregister from the module updates
   */
  public unregisterFromUpdates(callback: (render: string) => void): void {
    this.emitter.off(Module.UPDATE_STATE_KEY, callback)
  }

  /**
   * Register to the module data send
   */
  public registerToSend(callback: (id: string, type: string, data: ModuleProps) => void): void {
    this.emitter.on(Module.SEND_DATA_KEY, callback)
  }

  /**
   * Unregister from the module data send
   */
  public unregisterFromSend(callback: (id: string, type: string, data: ModuleProps) => void): void {
    this.emitter.off(Module.SEND_DATA_KEY, callback)
  }

  /**
   * Give data to the module
   * @param type The type of received data (usually the key of the device accessor)
   * @param data The data to give
   */
  public receiveData(type: string, data: unknown): void {
    this.onReceive(type, data)
  }

  get name(): string {
    return this._configuration.name
  }

  get description(): string {
    return this._configuration.description
  }

  get version(): string {
    return this._configuration.version
  }

  get author(): string {
    return this._configuration.author
  }

  get renderer(): ModuleRenderer | undefined {
    return this._renderer
  }

  get currentConfig(): SpecificConfiguration {
    return this._configuration.specificConfig
  }

  get icon(): string {
    return this._configuration.icon
  }

  get requires(): string[] {
    return this._configuration.requires
  }

  /**
   * Get the default configuration for this module
   * @returns The default configuration for this module
   */
  get defaultConfig(): SpecificConfiguration {
    return this._configuration.default
  }

  /**
   * Get a specific configuration entry value
   * @param key The key of the entry
   * @returns The value of the associated entry key
   */
  protected getEntryValue<T>(key: string): T {
    return this._configuration.specificConfig.getEntry(key)?.value as T
  }

  /**
   * Notifies a state change and triggers a re-render
   * @param data The data to send
   */
  protected notify<T extends ModuleProps>(data: T): void {
    // Render the module to HTML and emit the result
    if (this._renderer) {
      this.emitter.emit(Module.UPDATE_STATE_KEY, this._renderer.render(data))
    }
  }

  /**
   * Emit data out of the module
   * @param type type of the data (usually to match different targets (http, usb, etc.))
   * @param data data to send
   */
  protected sendData(type: string, data: unknown): void {
    this.emitter.emit(Module.SEND_DATA_KEY, type, data)
  }

  /**
   * Called when the module receives data
   * @param type The type of received data (usually the key of the device accessor)
   * @param data The data to process
   */
  protected abstract onReceive(type: string, data: unknown): void

  /**
   * Called when a new subscriber is registered to the module render updates
   * This method is useful to send the current or initial state to the new subscriber
   */
  protected abstract onNewSubscriber(): void

  /**
   * Called when the configuration values are changed
   * This method is usefull if the module need to react to configuration changes
   */
  protected onConfigurationChanged(): void {}
}
