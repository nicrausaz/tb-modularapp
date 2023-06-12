import { Manager } from '@yalk/module-manager'
import { getDB } from '../../database/database'
import { ModuleEntity } from '../models/entities/Module'
import ModuleMapper from '../mappers/ModuleMapper'
import { ModuleProps } from '@yalk/module'

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

  /**
   * Set module enabled in the manager and in the database
   * @param moduleId module id
   */
  enableModule(moduleId: string) {
    this.manager.enableModule(moduleId)

    const db = getDB()
    db.run('UPDATE Modules SET enabled = 1 WHERE id = ?', [moduleId], (err) => {
      if (err) {
        console.log(err)
      }
    })
    db.close()
  }

  disableModule(moduleId: string) {
    this.manager.disableModule(moduleId)

    const db = getDB()
    db.run('UPDATE Modules SET enabled = 0 WHERE id = ?', [moduleId], (err) => {
      if (err) {
        console.log(err)
      }
    })
    db.close()
  }

  async registerModule(moduleId: string) {
    if (!(await this.manager.loadModule(moduleId))) {
      console.log("Couldn't register module, because the load failed. It means the module is not correctly structured.")
      return false
    }

    // TODO: check this, no need to give the path ?

    const entry = this.manager.getModule(moduleId)
    const moduleEntity = ModuleMapper.toModuleEntity(moduleId, entry.module, entry.enabled)

    const db = getDB()
    db.run(
      'INSERT INTO Modules (id, name, description, version, author, configuration) VALUES (?, ?, ?, ?, ?, ?)',
      [
        moduleId,
        moduleEntity.name,
        moduleEntity.description,
        moduleEntity.version,
        moduleEntity.author,
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

  unregisterModule(moduleId: string) {
    this.manager.unregisterModule(moduleId)

    const db = getDB()
    db.run('DELETE FROM modules WHERE id = ?', [moduleId], (err) => {
      if (err) {
        console.log(err)
      }
    })

    db.close()
  }

  getModules() {
    return this.manager.getModules()
  }

  getModule(id: string) {
    return this.manager.getModule(id)
  }

  subscribeTo(moduleId: string, callback: (data: ModuleProps) => void) {
    this.manager.subscribeTo(moduleId, callback)
  }

  unsubscribeFrom(moduleId: string, callback: (data: ModuleProps) => void) {
    this.manager.unsubscribeFrom(moduleId, callback)
  }

  stop() {
    this.manager.stop()
  }

  private async startEnabledModules() {
    const modules = await this.enabledModules()

    for (const module of modules) {
      this.manager.enableModule(module.id)
    }
  }

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
