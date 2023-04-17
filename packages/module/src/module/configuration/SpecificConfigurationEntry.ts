type SpecificConfigurationEntryType = 'string' | 'number' | 'boolean' | 'array'

type SpecificConfigurationEntryTypeValue = string | number | boolean | Array<unknown>

export type SpecificConfigurationEntry = {
  type: SpecificConfigurationEntryType

  name?: string

  label: string

  placeholder?: string

  description?: string

  value: SpecificConfigurationEntryTypeValue
}
