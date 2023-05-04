import { SpecificConfigurationEntry } from '@yalk/module'

export type ModuleDTO = {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly author: string
  readonly version: string
}

export type ModuleDTOWithConfigs = {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly author: string
  readonly version: string
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