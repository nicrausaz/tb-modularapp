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
  }
}
