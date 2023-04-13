import { SpecificConfiguration } from "./configuration/SpecificConfiguration"

export class Configuration {
  private readonly _defaultEntries: SpecificConfiguration

  public constructor(
    private readonly _name: string,
    private readonly _description: string,
    private readonly _version: string,
    private readonly _author: string,
    private readonly _specificEntries?: SpecificConfiguration,
  ) {
    this._defaultEntries = this._specificEntries || ({} as SpecificConfiguration)
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

  get specificConfig(): SpecificConfiguration {
    return this._specificEntries || ({} as SpecificConfiguration)
  }

  public default(): SpecificConfiguration {
    // todo: copy the default entries
    return this._defaultEntries
  }
}
