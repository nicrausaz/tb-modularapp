import { Manager } from '@yalk/module-manager'
import { getDB } from '../../database/database'
import { ModuleEntity } from '../models/entities/Module'
import ModuleMapper from '../mappers/ModuleMapper'
import { Module } from '@yalk/module'

/**
 * Record type to represent a module in the database and in the manager
 */
export type ModuleDatabaseManagerRecord = {
  readonly id: string
  readonly name: string
  readonly nickname?: string
  readonly description: string
  readonly author: string
  readonly version: string
  readonly enabled: boolean
  readonly icon?: string
  readonly importedAt: Date
  readonly module: Module
}

/**
 * This class is a wrapper / adapter around the Manager class to add database functionalities
 * and persist the modules in the database.
 * It handles the synchronization between the database and the local modules, and can be used as
 * an entry point to access the modules and their events.
 */
export default class ModuleDatabaseManager {
  private manager: Manager

  constructor(dirModules: string) {
    this.manager = new Manager(dirModules)
    this.syncDBToLocalModules()
    this.startEnabledModules()
  }

  async getModules(): Promise<ModuleDatabaseManagerRecord[]> {
    // Merge database and module information
    const modules = this.manager.getModules()
    const dbModules = await this.modules()

    return modules.map((module) => {
      const dbModule = dbModules.find((dbModule) => dbModule.id === module.id)!
      return {
        ...dbModule,
        ...module,
      }
    })
  }

  async getModule(id: string): Promise<ModuleDatabaseManagerRecord> {
    // Merge database and module information
    const module = this.manager.getModule(id)
    const dbModule = await this.module(id)

    return {
      ...dbModule,
      ...module,
    }
  }

  /**
   * Set module enabled in the manager and in the database
   * @param moduleId module id
   */
  enableModule(moduleId: string): void {
    this.manager.enableModule(moduleId)

    const db = getDB()
    db.run('UPDATE Modules SET enabled = 1 WHERE id = ?', [moduleId], (err) => {
      if (err) {
        console.log(err)
      }
    })
    db.close()
  }

  /**
   * Set module disabled in the manager and in the database
   * @param moduleId module id
   */
  disableModule(moduleId: string): void {
    this.manager.disableModule(moduleId)

    const db = getDB()
    db.run('UPDATE Modules SET enabled = 0 WHERE id = ?', [moduleId], (err) => {
      if (err) {
        console.log(err)
      }
    })
    db.close()
  }

  /**
   * Register a module in the database and in the manager
   * @param moduleId module id
   * @returns true if the module was correctly registered, false otherwise
   */
  async registerModule(moduleId: string): Promise<boolean> {
    if (!(await this.manager.loadModule(moduleId))) {
      console.log("Couldn't register module, because the load failed. It means the module is not correctly structured.")
      return false
    }

    const entry = this.manager.getModule(moduleId)
    const moduleEntity = ModuleMapper.ManagerEntrytoModuleEntity(moduleId, entry.module, entry.enabled)

    const db = getDB()
    db.run(
      'INSERT INTO Modules (id, name, description, version, author, icon, configuration) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        moduleId,
        moduleEntity.name,
        moduleEntity.description,
        moduleEntity.version,
        moduleEntity.author,
        moduleEntity.icon,
        JSON.stringify(moduleEntity.configuration),
      ],
      (err) => {
        if (err) {
          console.log(err)
        }
      },
    )
    db.close()
    return true
  }

  /**
   * Unregister a module from the database and from the manager
   * The module will be stopped and deleted from the manager and the database
   * @param moduleId module id
   */
  unregisterModule(moduleId: string): void {
    this.manager.unregisterModule(moduleId)

    const db = getDB()
    db.run('DELETE FROM modules WHERE id = ?', [moduleId], (err) => {
      if (err) {
        console.log(err)
      }
    })

    db.close()
  }

  /**
   * Subscribe to a module event
   * @param moduleId module id
   * @param callback callback function to call when the event is triggered
   */
  subscribeTo(moduleId: string, callback: (render: string) => void): void {
    this.manager.subscribeTo(moduleId, callback)
  }

  /**
   * Unsubscribe from a module event
   * @param moduleId module id
   * @param callback callback function to unbind
   */
  unsubscribeFrom(moduleId: string, callback: (render: string) => void): void {
    this.manager.unsubscribeFrom(moduleId, callback)
  }

  /**
   * Stop the manager and all the modules
   */
  stop(): void {
    this.manager.stop()
  }

  /**
   * Send data to a module
   * @param moduleId module id
   * @param data data to send
   */
  sendDataTo(moduleId: string, data: unknown): void {
    this.manager.sendDataTo(moduleId, data)
  }

  /**
   * Start all the enabled modules in the database
   */
  private async startEnabledModules(): Promise<void> {
    const modules = await this.enabledModules()

    for (const module of modules) {
      this.manager.enableModule(module.id)
    }
  }

  /**
   * Check if a module is in the database
   * @param moduleId module id
   * @returns true if the module is in the database, false otherwise
   */
  private moduleExists(moduleId: string): Promise<boolean> {
    const db = getDB()

    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM Modules WHERE id = ?', [moduleId], (err, rows) => {
        if (err) {
          reject(err)
        }
        return resolve(rows.length > 0)
      })
      db.close()
    })
  }

  /**
   * Synchronize the database with the local modules
   * This will add the modules that are not in the database and remove the modules that are not in the local modules
   * This ensures that the database is up to date with the local modules
   */
  private async syncDBToLocalModules(): Promise<void> {
    await this.manager.loadModulesFromPath()

    // Check if the module is in the database, if not, add it
    for (const entry of this.manager.getModules()) {
      const { id } = entry
      if (!(await this.moduleExists(id))) {
        this.registerModule(id)
      }
    }
  }

  /**
   * Get all the modules from the database
   */
  private async modules(): Promise<ModuleEntity[]> {
    const db = getDB()

    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM modules', (err, rows) => {
        if (err) {
          reject(err)
        }
        return resolve(rows as ModuleEntity[])
      })
      db.close()
    })
  }

  /**
   * Get a module from the database
   * @param id module id
   */
  private async module(id: string): Promise<ModuleEntity> {
    const db = getDB()

    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM modules WHERE id = ?', [id], (err, rows) => {
        if (err) {
          reject(err)
        }
        return resolve(rows[0] as ModuleEntity)
      })
      db.close()
    })
  }

  /**
   * Get all the enabled modules from the database
   */
  private async enabledModules(): Promise<ModuleEntity[]> {
    const db = getDB()

    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM modules WHERE enabled = 1', (err, rows) => {
        if (err) {
          reject(err)
        }
        return resolve(rows as ModuleEntity[])
      })
      db.close()
    })
  }
}
