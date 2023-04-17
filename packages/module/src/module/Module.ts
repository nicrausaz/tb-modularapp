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
   * Called when the module is registered to the manager
   */
  abstract init(): this

  /**
   * Called when the module is unregistered from the manager
   */
  abstract destroy(): void

  /**
   * Called when the module is started
   */
  abstract start(): void

  /**
   * Called when the module is stopped
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

  /**
   * Get a the default configuration for this module
   * @returns The default configuration for this module
   */
  defaultConfig(): SpecificConfiguration {
    return this.configuration.default()
  }

  // tmp
  toDTO() {
    return {
      name: this.name,
      description: this.description,
      version: this.version,
      author: this.author,
      specificEntries: this.configuration.specificConfig,
    }
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
