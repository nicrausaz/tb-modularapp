import ModuleMapper from '../mappers/ModuleMapper'
import { ModuleConfigurationUpdateDTO } from '../models/DTO/ModuleDTO'
import { ModuleRepository } from '../repositories'
import { ModuleProps } from '@yalk/module'
import type { UploadedFile } from 'express-fileupload'

/**
 * The module service implements the business logic for the modules
 */
export default class ModuleService {
  constructor(private moduleRepository: ModuleRepository) {}

  getModules = () => {
    return this.moduleRepository
      .getModules()
      .map((entry) => ModuleMapper.toModuleDTO(entry.id, entry.module, entry.enabled))
  }

  getModule = (id: string) => {
    const entry = this.moduleRepository.getModuleById(id)

    if (!module) {
      return null
    }

    return ModuleMapper.toModuleDTOWithConfigs(id, entry.module, entry.enabled)
  }

  getModuleWithEvents = (id: string) => {
    const module = this.moduleRepository.getModuleById(id)

    if (!module || !module.enabled) {
      return null
    }

    return module
  }

  updateModuleConfiguration = (id: string, config: ModuleConfigurationUpdateDTO) => {
    const entry = this.moduleRepository.getModuleById(id)

    if (!entry) {
      return null
    }

    return this.moduleRepository.updateModuleConfiguration(id, config)
  }

  updateModuleEnabled = (id: string, enabled: boolean) => {
    const entry = this.moduleRepository.getModuleById(id)

    if (!entry) {
      return null
    }

    return this.moduleRepository.updateModuleEnabled(id, enabled)
  }

  subscribeToModuleEvents = (id: string, handler: (data: ModuleProps) => void) => {
    return this.moduleRepository.subscribeToModuleEvents(id, handler)
  }

  unsubscribeFromModuleEvents = (id: string, handler: (data: ModuleProps) => void) => {
    return this.moduleRepository.unsubscribeFromModuleEvents(id, handler)
  }

  registerModule = (id: string) => {
    return this.moduleRepository.registerModule(id)
  }

  uploadModule = (file: UploadedFile) => {
    return this.moduleRepository.uploadModule(file) 
  }
}
