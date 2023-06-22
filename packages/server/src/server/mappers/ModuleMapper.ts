import { SpecificConfiguration, Module, SpecificConfigurationEntry } from '@yalk/module'
import { ModuleDTO, ModuleDTOWithConfigs } from '../models/DTO/ModuleDTO'
import { ModuleEntity } from '../models/entities/Module'
import { ModuleDatabaseManagerRecord } from '../helpers/ModuleDatabaseManager'

export default class ModuleMapper {
  static DBManagerEntryToModuleDTO(entry: ModuleDatabaseManagerRecord): ModuleDTO {
    return {
      id: entry.id,
      name: entry.name,
      description: entry.description,
      author: entry.author,
      version: entry.version,
      icon: entry.icon,
      nickname: entry.nickname,
      enabled: entry.enabled,
      importedAt: entry.importedAt,
    }
  }

  static toModuleDTO(entry: ModuleDatabaseManagerRecord): ModuleDTO {
    return {
      id: entry.id,
      name: entry.name,
      description: entry.description,
      author: entry.author,
      version: entry.version,
      icon: entry.icon,
      nickname: entry.nickname,
      enabled: entry.enabled,
      importedAt: entry.importedAt,
    }
  }

  static toModuleDTOWithConfigs(entry: ModuleDatabaseManagerRecord): ModuleDTOWithConfigs {
    return {
      ...this.toModuleDTO(entry),
      defaultConfig: this.toModuleConfigurationDTO(entry.module.defaultConfig),
      currentConfig: this.toModuleConfigurationDTO(entry.module.currentConfig),
    }
  }

  static toModuleConfigurationDTO(config: SpecificConfiguration): SpecificConfigurationEntry[] {
    const entries = []

    for (const value of config.entries.values()) {
      entries.push(value)
    }
    return entries
  }

  static DBManagerEntrytoModuleEntity(entry: ModuleDatabaseManagerRecord): ModuleEntity {
    return {
      id: entry.id,
      name: entry.name,
      description: entry.description,
      author: entry.author,
      version: entry.version,
      configuration: this.toModuleConfigurationDTO(entry.module.currentConfig),
      enabled: entry.enabled,
      icon: entry.icon,
      nickname: entry.nickname,
      importedAt: entry.importedAt,
    }
  }

  static ManagerEntrytoModuleEntity(id: string, module: Module, enabled: boolean): ModuleEntity {
    return {
      id: id,
      name: module.name,
      description: module.description,
      author: module.author,
      version: module.version,
      configuration: this.toModuleConfigurationDTO(module.currentConfig),
      enabled: enabled,
      icon: module.icon,
      importedAt: new Date(),
    }
  }

  // TODO: less data in slot
  static toSlotModule(module: ModuleEntity): ModuleDTO {
    return {
      id: module.id,
      name: module.name,
      description: module.description,
      author: module.author,
      version: module.version,
      enabled: module.enabled,
      icon: module.icon,
      nickname: module.nickname,
      importedAt: module.importedAt,
    }
  }
}
