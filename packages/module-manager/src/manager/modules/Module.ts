import EventEmitter from 'events'
import { Configuration } from './Configuration'
import { SpecificConfiguration } from './configuration/SpecificConfiguration'

export default abstract class Module extends EventEmitter {
  constructor(private readonly configuration: Configuration) {
    super()
  }

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

  /**
   * Get a the default configuration for this module
   * @returns The default configuration for this module
   */
  defaultConfig(): SpecificConfiguration {
    return this.configuration.default()
  }
}
