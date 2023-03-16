import Module from './Module'

export default abstract class ConfigurableModule<ConfigType> extends Module {
  protected _config!: ConfigType

  /**
   * Load a configuration into the module
   * @param config The configuration to load
   * @returns this
   */
  config(config: ConfigType): this {
    this._config = config
    return this
  }
}
