/**
 * Defines the allowed types for a specific configuration entry.
 */
export type SpecificConfigurationEntryType = 'text' | 'number' | 'bool' | 'option' | 'secret'

/**
 * Defines the allowed values for a specific configuration entry.
 */
type SpecificConfigurationEntryTypeValueMap = {
  text: string
  number: number
  bool: boolean
  option: string
  secret: string
}

export type SpecificConfigurationEntryTypeValue = SpecificConfigurationEntryTypeValueMap[SpecificConfigurationEntryType]

/**
 * Defines a specific configuration entry.
 */
export type SpecificConfigurationEntry<T extends SpecificConfigurationEntryType = SpecificConfigurationEntryType> = {
  type: T
  name: string
  label: string
  description?: string
  value: SpecificConfigurationEntryTypeValueMap[T]
  options?: T extends 'option' ? Array<string> : undefined
}
