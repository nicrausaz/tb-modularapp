import EventEmitter from 'events'
import { Configuration } from './configuration/Configuration'
import { SpecificConfiguration } from './configuration/SpecificConfiguration'
import ModuleRenderer from './ModuleRenderer'
import { SpecificConfigurationEntryTypeValue } from './configuration/SpecificConfigurationEntry'

export interface ModuleProps {
  [key: string]: unknown
}

export default abstract class Module extends EventEmitter {
  static readonly UPDATE_STATE_KEY = 'update'
  static readonly RECEIVE_DATA_KEY = 'data'

  constructor(private readonly _configuration: Configuration, private readonly _renderer?: ModuleRenderer) {
    super()
    // Bind the onReceive event
    this.on(Module.RECEIVE_DATA_KEY, () => this.onReceive)
  }

  /**
   * Initialize the module
   */
  abstract init(): void

  /**
   * Clear the module
   */
  abstract destroy(): void

  /**
   * Start the module
   */
  abstract start(): void

  /**
   * Stop the module
   */
  stop(): void {
    this.removeAllListeners()
  }

  /**
   * Called when the module receives data
   * @param data The data to process
   */
  abstract onReceive(data: ModuleProps): void

  /**
   * Apply configuration changes to the module, only existing fiels will be updated, others will be ignored
   * @param configuration The configuration to apply
   */
  setConfiguration(configuration: Array<{ name: string; value: SpecificConfigurationEntryTypeValue }>) {
    configuration.forEach((field) => {
      this.currentConfig.updateEntryFromKey(field.name, field.value)
    })
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
   * Emit an update event
   * @param data The data to send
   */
  protected notify<T extends ModuleProps>(data: T): void {
    this.emit(Module.UPDATE_STATE_KEY, data)
  }
}
