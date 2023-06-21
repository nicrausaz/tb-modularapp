import { getDB } from '../../database/database'
import ModuleDatabaseManager from '../helpers/ModuleDatabaseManager'
import ModuleMapper from '../mappers/ModuleMapper'
import { ModuleConfigurationUpdateDTO } from '../models/DTO/ModuleDTO'
import { ModuleProps } from '@yalk/module'
import type { UploadedFile } from 'express-fileupload'
import { randomUUID } from 'crypto'
import { mkdirSync, rmSync } from 'fs'
import AdmZip from 'adm-zip'

export default class ModuleRepository {
  constructor(private manager: ModuleDatabaseManager) {}

  getModules() {
    return this.manager.getModules()
  }

  getModuleById(id: string) {
    return this.manager.getModule(id)
  }

  updateModuleConfiguration(id: string, config: ModuleConfigurationUpdateDTO) {
    const entry = this.manager.getModule(id)

    if (!module) {
      return null
    }

    entry.module.setConfiguration(config.fields)

    const moduleEntity = ModuleMapper.toModuleEntity(id, entry.module, entry.enabled)

    const db = getDB()
    db.run(
      'UPDATE Modules SET configuration = ? WHERE id = ?',
      [JSON.stringify(moduleEntity.configuration), id],
      (err) => {
        if (err) {
          console.log(err)
        }
      },
    )
    db.close()
  }

  updateModuleEnabled(id: string, enabled: boolean) {
    enabled ? this.manager.enableModule(id) : this.manager.disableModule(id)
    return this.manager.getModule(id)
  }

  subscribeToModuleEvents(id: string, handler: (data: ModuleProps) => void) {
    this.manager.subscribeTo(id, handler)
  }

  unsubscribeFromModuleEvents(id: string, handler: (data: ModuleProps) => void) {
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
