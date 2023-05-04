import { getDB } from '../../database/database'
import ModuleDatabaseManager from '../helpers/ModuleDatabaseManager'
import { ModuleConfigurationUpdateDTO } from '../models/DTO/ModuleDTO'

export default class ModuleRepository {
  constructor(private manager: ModuleDatabaseManager) {}

  getModules() {
    return this.manager.getModules()
  }

  getModuleById(id: string) {
    return this.manager.getModule(id)
  }

  updateModuleConfiguration(id: string, config: ModuleConfigurationUpdateDTO) {
    const module = this.manager.getModule(id)

    if (!module) {
      return null
    }

    module.setConfiguration(config.fields)

    const db = getDB()
    db.run('UPDATE Modules SET configuration = ? WHERE id = ?', [JSON.stringify(module.currentConfig), id], (err) => {
      if (err) {
        console.log(err)
      }
    })
    db.close()
  }
}
