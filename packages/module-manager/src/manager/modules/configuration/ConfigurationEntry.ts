export type SpecificConfigurationEntryType = 'string' | 'number' | 'boolean' | 'array'

export type SpecificConfigurationEntry = {
  type: SpecificConfigurationEntryType

  name?: string

  label: string

  placeholder?: string

  description?: string

  value: unknown
}
