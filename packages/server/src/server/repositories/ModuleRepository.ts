import { getDB } from '../../database/database'
import ModuleDatabaseManager from '../helpers/ModuleDatabaseManager'
import ModuleMapper from '../mappers/ModuleMapper'
import { ModuleConfigurationUpdateDTO, ModuleDTO, ModuleDTOWithConfigs } from '../models/DTO/ModuleDTO'
import { ModuleProps } from '@yalk/module'
import type { UploadedFile } from 'express-fileupload'
import { randomUUID } from 'crypto'
import { mkdirSync, rmSync } from 'fs'
import AdmZip from 'adm-zip'

export default class ModuleRepository {
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
  async getModuleById(id: string): Promise<ModuleDTOWithConfigs> {
    const module = await this.manager.getModule(id)

    return ModuleMapper.toModuleDTOWithConfigs(module)
  }

  async updateModuleConfiguration(id: string, config: ModuleConfigurationUpdateDTO): Promise<string | null> {
    const entry = await this.manager.getModule(id)

    if (!entry) {
      return null
    }

    entry.module.setConfiguration(config.fields)
    const moduleEntity = ModuleMapper.DBManagerEntrytoModuleEntity(entry)

    const db = getDB()

    return new Promise((resolve, reject) => {
      db.all(
        'UPDATE Modules SET configuration = ? WHERE id = ? RETURNING id',
        [JSON.stringify(moduleEntity.configuration), id],
        (err, rows) => {
          if (err) {
            reject(err)
          }

          resolve(rows[0] as string)
        },
      )
      db.close()
    })
  }

  updateModuleEnabled(id: string, enabled: boolean) {
    enabled ? this.manager.enableModule(id) : this.manager.disableModule(id)
    return id
  }

  subscribeToModuleEvents(id: string, handler: (render: string) => void) {
    this.manager.subscribeTo(id, handler)
  }

  unsubscribeFromModuleEvents(id: string, handler: (render: string) => void) {
    this.manager.unsubscribeFrom(id, handler)
  }

  registerModule(id: string) {
    return this.manager.registerModule(id)
  }

  unregisterModule(id: string) {
    return this.manager.unregisterModule(id)
  }

  async uploadModule(file: UploadedFile) {
    const copyFiles = ['config.json', 'index.js', 'app.js'] // TODO: Make this configurable
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
        const zipEntries = zip.getEntries().filter((entry) => copyFiles.includes(entry.name))
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
