import ModuleMapper from '../mappers/ModuleMapper'
import { ModuleConfigurationUpdateDTO } from '../models/DTO/ModuleDTO'
import { ModuleRepository } from '../repositories'

/**
 * The module service implements the business logic for the modules
 */
export default class ModuleService {
  constructor(private moduleRepository: ModuleRepository) {}

  getModules = () => {
    return this.moduleRepository.getModules().map((entry) => ModuleMapper.toModuleDTO(entry.id, entry.module))
  }

  getModule = (id: string) => {
    const module = this.moduleRepository.getModuleById(id)

    if (!module) {
      return null
    }
    const moduleDTO = ModuleMapper.toModuleDTOWithConfigs(id, module)

    return moduleDTO
  }

  getModuleWithEvents = (id: string) => {
    const module = this.moduleRepository.getModuleById(id)

    if (!module) {
      return null
    }

    return module
  }

  updateModuleConfiguration = (id: string, config: ModuleConfigurationUpdateDTO) => {
    return this.moduleRepository.updateModuleConfiguration(id, config)
  }
}
