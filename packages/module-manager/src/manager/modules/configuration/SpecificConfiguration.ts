import { SpecificConfigurationEntry } from './ConfigurationEntry'

type EntryName = string

export class SpecificConfiguration {
  readonly entries: Map<EntryName, SpecificConfigurationEntry> = new Map()

  constructor(entries: SpecificConfigurationEntry[]) {
    entries.forEach((entry) => {
      this.entries.set(entry.name!, entry)
    })
  }

  getEntry(name: EntryName): SpecificConfigurationEntry | undefined {
    return this.entries.get(name)
  }

  toArray(): SpecificConfigurationEntry[] {
    return Array.from(this.entries.values())
  }
}

export const specificConfigurationReader = (rawConfiguration: object) => {
  const entries: SpecificConfigurationEntry[] = []
  Object.entries(rawConfiguration).forEach(([key, value]) => {
    entries.push({
      name: key,
      ...value,
    })
  })
  return new SpecificConfiguration(entries)
}
