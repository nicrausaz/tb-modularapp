import { ModuleConfigurationUpdateDTO, ModuleDTO, ModuleDTOWithConfigs } from '../models/DTO/ModuleDTO'
import { ModuleRepository } from '../repositories'
import { ModuleProps } from '@yalk/module'
import type { UploadedFile } from 'express-fileupload'

/**
 * The module service implements the business logic for the modules
 */
export default class ModuleService {
  constructor(private moduleRepository: ModuleRepository) {}

  getModules = async (): Promise<ModuleDTO[]> => {
    return this.moduleRepository.getModules()
  }

  getModule = async (id: string): Promise<ModuleDTOWithConfigs | null> => {
    return this.getModuleEntry(id)
  }

  getModuleWithEvents = async (id: string): Promise<ModuleDTOWithConfigs | null> => {
    const entry = await this.getModuleEntry(id)
    return entry?.enabled ? entry : null
  }

  updateModuleConfiguration = (id: string, config: ModuleConfigurationUpdateDTO) => {
    const entry = this.getModuleEntry(id)

    if (!entry) {
      return null
    }

    return this.moduleRepository.updateModuleConfiguration(id, config)
  }

  updateModuleEnabled = (id: string, enabled: boolean) => {
    const entry = this.getModuleEntry(id)

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

  unregisterModule = (id: string) => {
    return this.moduleRepository.unregisterModule(id)
  }

  private getModuleEntry = async (id: string) => {
    try {
      return await this.moduleRepository.getModuleById(id)
    } catch (_) {
      return null
    }
  }
}
