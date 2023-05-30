export type Configuration = Array<ConfigurationEntry>

export type ConfigurationEntry = {
  readonly type: 'text' | 'number' | 'bool' | 'option'

  readonly name: string

  readonly label: string

  readonly placeholder?: string

  readonly description?: string

  value: string | number | boolean | Array<string> | undefined

  readonly options?: Array<string>
}
