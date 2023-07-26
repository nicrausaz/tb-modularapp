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
    private readonly _icon: string,
    private readonly _requires: string[],
    private readonly _specificEntries: SpecificConfiguration,
  ) {
    // Creates a deep copy of then entries, so the default configuration can be recovered
    this._defaultEntries = structuredClone(this._specificEntries)
  }

  public reset(): void {
    this._defaultEntries.entries.forEach((value, key) => {
      this._specificEntries.entries.set(key, { ...value })
    })
  }

  /**
   * Get the module name
   */
  get name(): string {
    return this._name
  }

  /**
   * Get the module description
   */
  get description(): string {
    return this._description
  }

  /**
   * Get the module version
   */
  get version(): string {
    return this._version
  }

  /**
   * Get the module author
   */
  get author(): string {
    return this._author
  }

  /**
   * Get the module icon path
   */
  get icon(): string {
    return this._icon
  }

  get requires(): string[] {
    return this._requires
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
