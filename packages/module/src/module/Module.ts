import EventEmitter from 'events'
import { Configuration } from './configuration/Configuration'
import { SpecificConfiguration } from './configuration/SpecificConfiguration'
import ModuleRenderer from './ModuleRenderer'
import { SpecificConfigurationEntryTypeValue } from './configuration/SpecificConfigurationEntry'
import { renderToStaticMarkup } from 'react-dom/server'

export interface ModuleProps {
  [key: string]: unknown
}

export default abstract class Module {
  private readonly emitter = new EventEmitter()
  private static readonly UPDATE_STATE_KEY = 'update'

  public constructor(private readonly _configuration: Configuration, private readonly _renderer?: ModuleRenderer) {}

  /**
   * Initialize the module
   */
  public abstract init(): void

  /**
   * Clear the module
   */
  public abstract destroy(): void

  /**
   * Start the module
   */
  public abstract start(): void

  /**
   * Stop the module
   */
  public stop(): void {
    this.emitter.removeAllListeners()
  }

  /**
   * Apply configuration changes to the module, only existing fiels will be updated, others will be ignored
   * @param configuration The configuration to apply
   */
  public setConfiguration(configuration: Array<{ name: string; value: SpecificConfigurationEntryTypeValue }>) {
    configuration.forEach((field) => {
      this.currentConfig.updateEntryFromKey(field.name, field.value)
    })
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
    console.log('unregister, has', this.emitter.listenerCount(Module.UPDATE_STATE_KEY), 'listeners')
  }

  /**
   * Give data to the module
   * @param data The data to give
   */
  public receiveData(data: ModuleProps): void {
    this.onReceive(data)
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
      this.emitter.emit(Module.UPDATE_STATE_KEY, renderToStaticMarkup(this._renderer.render(data)))
    }
  }

  /**
   * Called when the module receives data
   * @param data The data to process
   */
  protected abstract onReceive(data: ModuleProps): void

  /**
   * Called when a new subscriber is registered
   * This method is useful to send the current or initial state to the new subscriber
   */
  protected onNewSubscriber() {
    console.log(this.emitter.listenerCount(Module.UPDATE_STATE_KEY))
  }
}
