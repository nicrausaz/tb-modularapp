import { SpecificConfiguration, Module } from '@yalk/module'
import { ModuleDTO, ModuleDTOWithConfigs } from '../models/DTO/ModuleDTO'

export default class ModuleMapper {
  static toModuleDTO(id: string, module: Module): ModuleDTO {
    return {
      id: id,
      name: module.name,
      description: module.description,
      author: module.author,
      version: module.version,
    }
  }

  static toModuleDTOWithConfigs(id: string, module: Module): ModuleDTOWithConfigs {
    return {
      ...ModuleMapper.toModuleDTO(id, module),
      defaultConfig: ModuleMapper.toModuleConfigurationDTO(module.defaultConfig),
      currentConfig: ModuleMapper.toModuleConfigurationDTO(module.currentConfig),
    }
  }

  static toModuleConfigurationDTO(config: SpecificConfiguration) {
    const entries = []

    for (const value of config.entries.values()) {
      entries.push(value)
    }
    return entries
  }
}
