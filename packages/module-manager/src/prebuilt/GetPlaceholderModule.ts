import ConfigurableModule from '../manager/modules/ConfigurableModule'

export interface Config {
  url: String
}

export default class GetPlaceholderModule extends ConfigurableModule<Config> {
  name: string = 'Get Placeholder Module'

  description: string = 'A module that fetches data from the placeholder API'

  version: string = '0.0.1'

  init(): this {
    if (!this._config || !this._config.url) {
      throw new Error('Missing or invalid configuration')
    }
    return this
  }

  start(): void {
    console.log('Placeholder module start')
    fetch(`${this._config.url}`).then(async (response) => {
      console.log(await response.json())
    })
  }

  stop(): void {
    console.log('Placeholder module stop')
  }

  render(): string {
    return 'Placeholder module render'
  }
}
