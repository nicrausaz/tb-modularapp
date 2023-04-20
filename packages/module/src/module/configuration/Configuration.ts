import { SpecificConfiguration } from './SpecificConfiguration'

/**
 * Module configuration
 * A configuration describes a module basic information and its specific configuration
 * It stores the default configuration for the module, so it can be reset.
 */
export class Configuration {
  private readonly _defaultEntries: SpecificConfiguration

  public constructor(
    private readonly _name: string,
    private readonly _description: string,
    private readonly _version: string,
    private readonly _author: string,
    private readonly _specificEntries: SpecificConfiguration,
  ) {
    // Creates a deep copy of then entries, so the default configuration can be recovered
    this._defaultEntries = structuredClone(this._specificEntries)
  }

  get name(): string {
    return this._name
  }

  get description(): string {
    return this._description
  }

  get version(): string {
    return this._version
  }

  get author(): string {
    return this._author
  }

  /**
   * Get the specific configuration for this module
   */
  get specificConfig(): SpecificConfiguration {
    return this._specificEntries
  }

  /**
   * Get the default configuration for this module
   */
  get default(): SpecificConfiguration {
    return this._defaultEntries
  }
}
