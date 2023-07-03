import {
  ModuleActionException,
  ModuleDisabledException,
  ModuleNotFoundException,
  ModuleRedundantStatusException,
} from '../exceptions/Modules'
import ModuleLiveUpdater from '../helpers/ModuleLiveUpdater'
import { ModuleConfigurationUpdateDTO, ModuleDTO, ModuleDTOWithConfig, UpdateModuleDTO } from '../models/DTO/ModuleDTO'
import { ModulesRepository, ScreensRepository } from '../repositories'
import type { UploadedFile } from 'express-fileupload'

/**
 * The module service implements the business logic for the modules
 */
export default class ModulesService {
  constructor(
    private modulesRepository: ModulesRepository,
    private screensRepository: ScreensRepository,
    public moduleUpdater: ModuleLiveUpdater, // todo: change this to private
  ) {}

  /**
   * Get all modules
   */
  getModules = async (): Promise<ModuleDTO[]> => {
    return this.modulesRepository.getModules()
  }

  /**
   * Get a module by its id
   */
  getModule = async (id: string): Promise<ModuleDTOWithConfig> => {
    return this.getModuleEntry(id)
  }

  /**
   * Update a module information if it exists
   * @throws ModuleNotFoundException if the module does not exist
   */
  updateModule = async (id: string, update: UpdateModuleDTO): Promise<string> => {
    if (!(await this.moduleExists(id))) {
      throw new ModuleNotFoundException(id)
    }

    return this.modulesRepository.updateModule(id, update)
  }

  /**
   * Get the current configuration of a module if it exists
   * @throws ModuleNotFoundException if the module does not exist
   */
  getModuleConfiguration = async (id: string) => {
    // Get the module entry or throw an exception if it does not exist
    return (await this.getModuleEntry(id)).currentConfig
  }

  /**
   * Update a module current configuration if it exists
   * @throws ModuleNotFoundException if the module does not exist
   */
  updateModuleConfiguration = async (id: string, config: ModuleConfigurationUpdateDTO) => {
    if (!(await this.moduleExists(id))) {
      throw new ModuleNotFoundException(id)
    }

    return this.modulesRepository.updateModuleConfiguration(id, config)
  }

  /**
   * Reset a module current configuration to its default if it exists
   * @throws ModuleNotFoundException if the module does not exist
   */
  resetModuleConfigurationToDefault = async (id: string) => {
    if (!(await this.moduleExists(id))) {
      throw new ModuleNotFoundException(id)
    }

    return this.modulesRepository.resetModuleConfiguration(id)
  }

  /**
   * Update a module enabled status if it exists and the status is differs from the current one
   *
   * @throws ModuleNotFoundException if the module does not exist
   * @throws ModuleRedundantStatusException if the module is already enabled/disabled
   * @throws ModuleActionException if the module could not be enabled/disabled
   */
  updateModuleEnabled = async (id: string, enabled: boolean) => {
    // Get the module entry or throw an exception if it does not exist
    const current = (await this.getModuleEntry(id)).enabled

    if (current && enabled) {
      throw new ModuleRedundantStatusException(id, 'enabled')
    }

    if (!current && !enabled) {
      throw new ModuleRedundantStatusException(id, 'disabled')
    }

    if (!this.modulesRepository.updateModuleEnabled(id, enabled)) {
      throw new ModuleActionException(id, enabled ? 'enable' : 'disable')
    }

    this.moduleUpdater.notifyChange(id)
  }

  /**
   * Subscribe to a module events if it exists and is enabled
   * Bind a callback to the module events
   *
   * @throws ModuleNotFoundException if the module does not exist
   * @throws ModuleDisabledException if the module is disabled
   */
  subscribeToModuleEvents = async (id: string, handler: (render: string) => void) => {
    // todo: move in live updater
    const entry = await this.getModuleEntry(id)

    
    if (!entry.enabled) {
      throw new ModuleDisabledException(id)
    }
    // this.moduleUpdater.subscribe(id, handler)

    console.log('subscribeToModuleEvents bind')
    this.modulesRepository.subscribeToModuleEvents(id, handler)
  }

  /**
   * Unsubscribe from a module events if it exists and is enabled
   * Unbind a previously registered callback
   *
   * @throws ModuleNotFoundException if the module does not exist
   * @throws ModuleDisabledException if the module is disabled
   */
  unsubscribeFromModuleEvents = async (id: string, handler: (render: string) => void) => {
    // todo: move in live updater
    const entry = await this.getModuleEntry(id)

    

    // if (!entry.enabled) {
    //   throw new ModuleDisabledException(id)
    // }

    // this.moduleUpdater.unsubscribe(id, handler)
    // this.modulesRepository.unsubscribeFromModuleEvents(id, handler)
  }

  /**
   * Send any data to a module if it exists and is enabled
   *
   * @throws ModuleNotFoundException if the module does not exist
   * @throws ModuleDisabledException if the module is disabled
   */
  sendEventToModule = async (id: string, data: unknown) => {
    // Get the module entry or throw an exception if it does not exist or is disabled
    const entry = await this.getModuleEntry(id)

    if (!entry.enabled) {
      throw new ModuleDisabledException(id)
    }

    return this.modulesRepository.sendEventToModule(id, data)
  }

  /**
   * Upload a zip file containing a module to the application.
   */
  uploadModule = (file: UploadedFile) => {
    return this.modulesRepository.uploadModule(file)
  }

  /**
   * Unregister a module from the application.
   * It will be completely removed from the database and the file system.
   * All related screens slots will be deleted.
   * @param id module id
   * @returns true if the module was successfully unregistered, false otherwise
   */
  unregisterModule = async (id: string) => {
    if (!this.moduleExists(id)) {
      throw new ModuleNotFoundException(id)
    }

    if (!this.modulesRepository.unregisterModule(id)) {
      throw new ModuleActionException(id, 'unregister')
    }

    return this.screensRepository.deleteModuleScreenSlots(id)
  }

  /**
   * Get a module entry from the database / manager
   * @param id module id
   * @returns module entry
   * @throws ModuleNotFoundException if the module does not exist
   */
  private getModuleEntry = async (id: string) => {
    try {
      return await this.modulesRepository.getModuleById(id)
    } catch (_) {
      throw new ModuleNotFoundException(id)
    }
  }

  /**
   * Check if a module exists
   * @param id module id
   * @returns true if the module exists, false otherwise
   */
  private moduleExists = async (id: string) => {
    return this.getModuleEntry(id)
      .then(() => true)
      .catch(() => false)
  }
}
