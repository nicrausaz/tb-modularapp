import { SpecificConfigurationEntry } from '@yalk/module'

export type ModuleDTO = {
  readonly id: string
  readonly name: string
  readonly nickname?: string
  readonly description: string
  readonly author: string
  readonly version: string
  readonly enabled: boolean
  readonly icon?: string
  readonly importedAt: Date
}

export type UpdateModuleDTO = {
  readonly nickname: string
}

export type ModuleDTOWithConfig = ModuleDTO & {
  currentConfig: SpecificConfigurationEntry[]
}

export type ModuleConfigurationFieldDTO = {
  readonly name: string
  readonly value: string
}

export type ModuleConfigurationUpdateDTO = {
  readonly fields: ModuleConfigurationFieldDTO[]
}

// TODO
export type InSlotModuleDTO = {
  readonly id: string
}