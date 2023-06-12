import { SpecificConfigurationEntry } from '@yalk/module'

export type ModuleDTO = {
  readonly id: string
  readonly name: string
  // nickname?: string
  readonly description: string
  readonly author: string
  readonly version: string
  readonly enabled: boolean
  // readonly importedAt: Date
}

export type ModuleDTOWithConfigs = ModuleDTO & {
  readonly defaultConfig: SpecificConfigurationEntry[]
  currentConfig: SpecificConfigurationEntry[]
}

export type ModuleConfigurationFieldDTO = {
  readonly name: string
  readonly value: string
}

export type ModuleConfigurationUpdateDTO = {
  readonly fields: ModuleConfigurationFieldDTO[]
}
