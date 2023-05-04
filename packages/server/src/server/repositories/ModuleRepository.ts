import { getDB } from '../../database/database'
import ModuleDatabaseManager from '../helpers/ModuleDatabaseManager'
import ModuleMapper from '../mappers/ModuleMapper'
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

    const moduleEntity = ModuleMapper.toModuleEntity(id, module)

    const db = getDB()
    db.run('UPDATE Modules SET configuration = ? WHERE id = ?', [JSON.stringify(moduleEntity.configuration), id], (err) => {
      if (err) {
        console.log(err)
      }
    })
    db.close()
  }
}
