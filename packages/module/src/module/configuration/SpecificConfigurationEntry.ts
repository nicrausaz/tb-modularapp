/**
 * Defines the allowed types for a specific configuration entry.
 */
export type SpecificConfigurationEntryType = 'text' | 'number' | 'bool' | 'option'

/**
 * Defines the allowed values for a specific configuration entry.
 */
export type SpecificConfigurationEntryTypeValue = string | number | boolean | Array<string>

/**
 * Defines a specific configuration entry.
 */
export type SpecificConfigurationEntry = {
  type: SpecificConfigurationEntryType

  name: string

  label: string

  description?: string

  value: SpecificConfigurationEntryTypeValue

  options?: Array<string>
}
