import { SpecificConfigurationEntry, SpecificConfigurationEntryTypeValue } from './SpecificConfigurationEntry'

type EntryName = string

/**
 * Module specific configuration
 * A specific configuration is a set configuration entries that are specific to a module
 * It is designed to to allow the user to configure the module
 */
export class SpecificConfiguration {
  readonly entries: Map<EntryName, SpecificConfigurationEntry> = new Map()

  private constructor(entries: SpecificConfigurationEntry[]) {
    entries.forEach((entry) => {
      this.entries.set(entry.name, entry)
    })
  }

  /**
   * Get a specific configuration entry by its name
   * @param name entry name
   * @returns the entry or undefined if it does not exist
   */
  public getEntry(name: EntryName): SpecificConfigurationEntry | undefined {
    return this.entries.get(name)
  }

  /**
   * Build a specific configuration from an object (usually from JSON configuration file)
   * @param rawConfiguration raw configuration object
   * @returns the specific configuration instance
   */
  public static fromObject(rawConfiguration: object): SpecificConfiguration {
    const entries: SpecificConfigurationEntry[] = []
    Object.entries(rawConfiguration).forEach(([key, value]) => {
      entries.push({
        name: key,
        ...value,
      })
    })
    return new SpecificConfiguration(entries)
  }

  /**
   * Update a specific configuration entry from its key, only if it exists
   * @param name name of the entry to update
   * @param value new value of the entry
   */
  public updateEntry(name: EntryName, value: SpecificConfigurationEntryTypeValue) {
    const entry = this.entries.get(name)
    if (entry) {
      entry.value = value
    }
  }
}
