import { Configuration } from './Configuration'

export type Module = {
  readonly id: string
  readonly name: string
  // nickname?: string
  readonly description: string
  readonly author: string
  readonly version: string
  enabled: boolean
  currentConfig: Configuration
  // readonly importedAt: Date
}
