import { Manager } from '@yalk/module-manager'

export default class ModuleRepository {
  constructor(private manager: Manager) {}

  getModules() {
    return this.manager.getModules().map((m) => m)
  }

  getModuleById(id: string) {
    return this.manager.getModule(id)
  }
}
