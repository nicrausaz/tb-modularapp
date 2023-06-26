import { ModuleConfigurationUpdateDTO, ModuleDTO, ModuleDTOWithConfigs, UpdateModuleDTO } from '../models/DTO/ModuleDTO'
import { ModuleRepository, ScreenRepository } from '../repositories'
import type { UploadedFile } from 'express-fileupload'

/**
 * The module service implements the business logic for the modules
 */
export default class ModuleService {
  constructor(private moduleRepository: ModuleRepository, private screenRepository: ScreenRepository) {}

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

  updateModule = (id: string, update: UpdateModuleDTO): Promise<string | null> => {
    return this.moduleRepository.updateModule(id, update)
  }

  updateModuleConfiguration = (id: string, config: ModuleConfigurationUpdateDTO) => {
    return this.moduleRepository.updateModuleConfiguration(id, config)
  }

  resetModuleConfigurationToDefault = (id: string) => {
    return this.moduleRepository.resetModuleConfiguration(id)
  }

  updateModuleEnabled = (id: string, enabled: boolean) => {
    return this.moduleRepository.updateModuleEnabled(id, enabled)
  }

  subscribeToModuleEvents = (id: string, handler: (render: string) => void) => {
    return this.moduleRepository.subscribeToModuleEvents(id, handler)
  }

  unsubscribeFromModuleEvents = (id: string, handler: (render: string) => void) => {
    return this.moduleRepository.unsubscribeFromModuleEvents(id, handler)
  }

  sendEventToModule = (id: string, data: unknown) => {
    return this.moduleRepository.sendEventToModule(id, data)
  }

  registerModule = (id: string) => {
    return this.moduleRepository.registerModule(id)
  }

  uploadModule = (file: UploadedFile) => {
    return this.moduleRepository.uploadModule(file)
  }

  unregisterModule = (id: string) => {
    this.moduleRepository.unregisterModule(id)
    return this.screenRepository.deleteModuleScreenSlots(id)
  }

  private getModuleEntry = async (id: string) => {
    try {
      return await this.moduleRepository.getModuleById(id)
    } catch (_) {
      return null
    }
  }
}
