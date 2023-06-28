import { SpecificConfigurationEntry } from '@yalk/module'

export type ModuleEntity = {
  id: string
  name: string
  nickname?: string
  icon?: string
  description: string
  version: string
  author: string
  configuration: string
  enabled: boolean
  importedAt: Date
}

export type ConfiguredModuleEntity = {
  id: string
  name: string
  nickname?: string
  icon?: string
  description: string
  version: string
  author: string
  configuration: Array<SpecificConfigurationEntry>
  enabled: boolean
  importedAt: Date
}
