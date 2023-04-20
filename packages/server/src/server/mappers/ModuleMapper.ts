import { SpecificConfiguration } from '@yalk/module'
import Module from 'module'

export default class ModuleMapper {
  static toModuleDTO(module: Module) {
    return module
  }

  static toModuleConfigurationDTO(config: SpecificConfiguration) {
    const entries = []

    for (const value of config.entries.values()) {
      entries.push(value)
    }
    return entries
  }
}
