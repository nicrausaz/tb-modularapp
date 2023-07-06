import { SpecificConfiguration, Module, SpecificConfigurationEntry } from '@yalk/module'
import { ModuleDTO, ModuleDTOWithConfig } from '../models/DTO/ModuleDTO'
import { ConfiguredModuleEntity, ModuleEntity } from '../models/entities/Module'
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
      requires: entry.module.requires,
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
      requires: entry.module.requires,
    }
  }

  static toModuleDTOWithConfig(entry: ModuleDatabaseManagerRecord): ModuleDTOWithConfig {
    return {
      ...this.toModuleDTO(entry),
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
      configuration: JSON.stringify(this.toModuleConfigurationDTO(entry.module.currentConfig)),
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
      configuration: JSON.stringify(this.toModuleConfigurationDTO(module.currentConfig)),
      enabled: enabled,
      icon: module.icon,
      importedAt: new Date(),
    }
  }

  // TODO: less data in slot (create a new DTO)
  static toSlotModule(module: ModuleEntity): Partial<ModuleDTO> {
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

  static entityToConfiguredModuleEntity(module: ModuleEntity): ConfiguredModuleEntity {
    return {
      ...module,
      configuration: JSON.parse(module.configuration),
    }
  }
}
