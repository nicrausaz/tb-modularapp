import { Manager } from '@yalk/module-manager'

/**
 * The module service implements the business logic for the modules
 */
export default class ModulesService {
  constructor(private manager: Manager) {}

  getModules = () => {
    return this.manager.getModules().map((m) => m)
  }
}
