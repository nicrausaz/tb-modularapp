import { SpecificConfiguration, Module } from '@yalk/module'
import { ModuleDTO, ModuleDTOWithConfigs } from '../models/DTO/ModuleDTO'
import { ModuleEntity } from '../models/Module'

export default class ModuleMapper {
  static toModuleDTO(id: string, module: Module, enabled: boolean): ModuleDTO {
    return {
      id: id,
      name: module.name,
      description: module.description,
      author: module.author,
      version: module.version,
      enabled: enabled,
    }
  }

  static toModuleDTOWithConfigs(id: string, module: Module, enabled: boolean): ModuleDTOWithConfigs {
    return {
      ...this.toModuleDTO(id, module, enabled),
      defaultConfig: this.toModuleConfigurationDTO(module.defaultConfig),
      currentConfig: this.toModuleConfigurationDTO(module.currentConfig),
    }
  }

  static toModuleConfigurationDTO(config: SpecificConfiguration) {
    const entries = []

    for (const value of config.entries.values()) {
      entries.push(value)
    }
    return entries
  }

  static toModuleEntity(id: string, module: Module, enabled: boolean): ModuleEntity {
    return {
      id: id,
      name: module.name,
      description: module.description,
      author: module.author,
      version: module.version,
      configuration: this.toModuleConfigurationDTO(module.currentConfig),
      enabled: enabled,
    }
  }
}
