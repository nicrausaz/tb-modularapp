import ModuleDatabaseManager from '../helpers/ModuleDatabaseManager'

export default class ModuleRepository {
  constructor(private manager: ModuleDatabaseManager) {}

  getModules() {
    return this.manager.getModules()
  }

  getModuleById(id: string) {
    return this.manager.getModule(id)
  }
}
