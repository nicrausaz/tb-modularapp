/**
 * Defines the allowed types for a specific configuration entry.
 */
type SpecificConfigurationEntryType = 'string' | 'number' | 'boolean' | 'array'

/**
 * Defines the allowed values for a specific configuration entry.
 */
type SpecificConfigurationEntryTypeValue = string | number | boolean | Array<unknown>

/**
 * Defines a specific configuration entry.
 */
export type SpecificConfigurationEntry = {
  type: SpecificConfigurationEntryType

  name: string

  label: string

  placeholder?: string

  description?: string

  value: SpecificConfigurationEntryTypeValue
}
