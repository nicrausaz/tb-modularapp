import { getDB } from '../../database/database'
import ModuleDatabaseManager from '../helpers/ModuleDatabaseManager'
import ModuleMapper from '../mappers/ModuleMapper'
import { ModuleConfigurationUpdateDTO, ModuleDTO, ModuleDTOWithConfig, UpdateModuleDTO } from '../models/DTO/ModuleDTO'
import type { UploadedFile } from 'express-fileupload'
import { randomUUID } from 'crypto'
import { mkdirSync, rmSync } from 'fs'
import AdmZip from 'adm-zip'

export default class ModulesRepository {
  constructor(private manager: ModuleDatabaseManager) {}

  /**
   * Get all existing modules
   * @returns modules
   */
  async getModules(): Promise<ModuleDTO[]> {
    const modules = await this.manager.getModules()

    return modules.map(ModuleMapper.DBManagerEntryToModuleDTO)
  }

  /**
   * Get a module by its id
   * @param id module id
   * @returns module
   */
  async getModuleById(id: string): Promise<ModuleDTOWithConfig> {
    const module = await this.manager.getModule(id)
    return ModuleMapper.toModuleDTOWithConfig(module)
  }

  /**
   * Update a module information
   * @param id module id
   * @param update module information
   */
  async updateModule(id: string, update: UpdateModuleDTO): Promise<string> {
    const db = getDB()
    return new Promise((resolve, reject) => {
      db.all('UPDATE Modules SET nickname = ? WHERE id = ? RETURNING id', [update.nickname, id], (err, rows) => {
        if (err) {
          reject(err)
        }

        resolve((rows[0] as { id: string }).id)
      })
      db.close()
    })
  }

  /**
   * Update a module current configuration
   * @param id module id
   * @param config module new configuration
   */
  async updateModuleConfiguration(id: string, config: ModuleConfigurationUpdateDTO): Promise<void> {
    const entry = await this.manager.getModule(id)
    entry.module.setConfiguration(config.fields)
    const moduleEntity = ModuleMapper.DBManagerEntrytoModuleEntity(entry)

    const db = getDB()
    return new Promise((resolve, reject) => {
      db.run('UPDATE Modules SET configuration = ? WHERE id = ?', [moduleEntity.configuration, id], (err) => {
        if (err) {
          reject(err)
        }
        resolve()
      })
      db.close()
    })
  }

  /**
   * Reset a module current configuration to its default
   * @param id module id to reset
   */
  async resetModuleConfiguration(id: string): Promise<void> {
    const entry = await this.manager.getModule(id)
    entry.module.resetConfiguration()
    const moduleEntity = ModuleMapper.DBManagerEntrytoModuleEntity(entry)

    const db = getDB()
    return new Promise((resolve, reject) => {
      db.run('UPDATE Modules SET configuration = ? WHERE id = ?', [moduleEntity.configuration, id], (err) => {
        if (err) {
          reject(err)
        }
        resolve()
      })
      db.close()
    })
  }

  /**
   * Update a module status (enabled or disabled)
   * @param id module id
   * @param enabled module status
   * @returns true if the module was enabled, false otherwise (module internal error)
   */
  updateModuleEnabled(id: string, enabled: boolean): boolean {
    return enabled ? this.manager.enableModule(id) : this.manager.disableModule(id)
  }

  /**
   * Send any data to a module
   * @param id module id
   * @param data data to send
   */
  sendEventToModule(id: string, data: unknown): void {
    this.manager.sendDataTo(id, data)
  }

  /**
   * Subscribe to a module events
   * @param id module id
   * @param handler callback to call when an event is received
   */
  subscribeToModuleEvents(id: string, handler: (render: string) => void): void {
    this.manager.subscribeTo(id, handler)
  }

  /**
   * Unsubscribe from a module events
   * @param id module id
   * @param handler callback to remove from the event listeners
   */
  unsubscribeFromModuleEvents(id: string, handler: (render: string) => void): void {
    this.manager.unsubscribeFrom(id, handler)
  }

  /**
   * Unregister a module
   * @param id module id
   * @returns true if the module was unregistered, false otherwise (module internal error)
   */
  unregisterModule(id: string): boolean {
    return this.manager.unregisterModule(id)
  }

  /**
   * Upload, extract the module zip file and register it
   * @param file zip file to upload
   * @returns id of the new registered module
   */
  async uploadModule(file: UploadedFile): Promise<string> {
    const moduleId = randomUUID()
    // Create the module directory
    mkdirSync(`${process.env.MODULES_DIR}/${moduleId}`)

    return new Promise((resolve, reject) => {
      // Move the files to the module directory
      file.mv(`${process.env.MODULES_DIR}/${moduleId}/${file.name}`, async (err) => {
        if (err) {
          reject(err)
        }

        // Unzip the module
        const zip = new AdmZip(`${process.env.MODULES_DIR}/${moduleId}/${file.name}`)
        const zipEntries = zip.getEntries().filter((entry) => {
          // TODO: might find a better way to do this (maybe with a regex to ignore potential harmful files)
          if (entry.entryName.startsWith('__MACOSX') || entry.entryName.startsWith('.')) {
            return false
          }
          return true
        })

        zipEntries.forEach((entry) =>
          zip.extractEntryTo(entry.entryName, `${process.env.MODULES_DIR}/${moduleId}`, false, true),
        )

        // Remove the zip file
        rmSync(`${process.env.MODULES_DIR}/${moduleId}/${file.name}`)

        // Add the module to the database
        const registered = await this.manager.registerModule(moduleId)
        if (registered) {
          resolve(moduleId)
        } else {
          rmSync(`${process.env.MODULES_DIR}/${moduleId}`, { recursive: true })
          reject('The module could not be registered. Please check its configuration.')
        }
      })
    })
  }
}
