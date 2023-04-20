import EventEmitter from 'events'
import { Configuration } from './configuration/Configuration'
import { SpecificConfiguration } from './configuration/SpecificConfiguration'
import ModuleRenderer from './ModuleRenderer'

export interface ModuleProps {
  [key: string]: unknown
}

export default abstract class Module extends EventEmitter {
  constructor(private readonly configuration: Configuration, private readonly _renderer?: ModuleRenderer) {
    super()
  }

  /**
   * Initialize the module
   */
  abstract init(): this

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
  abstract stop(): void

  get name(): string {
    return this.configuration.name
  }

  get description(): string {
    return this.configuration.description
  }

  get version(): string {
    return this.configuration.version
  }

  get author(): string {
    return this.configuration.author
  }

  get renderer(): ModuleRenderer | undefined {
    return this._renderer
  }

  get currentConfig(): SpecificConfiguration {
    return this.configuration.specificConfig
  }

  /**
   * Get the default configuration for this module
   * @returns The default configuration for this module
   */
  get defaultConfig(): SpecificConfiguration {
    return this.configuration.default
  }

  /**
   * Get a specific configuration entry value
   * @param key The key of the entry
   * @returns The value of the associated entry key
   */
  protected getEntryValue<T>(key: string): T {
    return this.configuration.specificConfig.getEntry(key)?.value as T
  }
}
