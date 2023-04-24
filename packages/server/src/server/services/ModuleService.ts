import { ModuleRepository } from '../repositories'

/**
 * The module service implements the business logic for the modules
 */
export default class ModuleService {
  constructor(private moduleRepository: ModuleRepository) {}

  getModules = () => {
    return this.moduleRepository.getModules()
  }

  getModule = (id: string) => {
    return this.moduleRepository.getModuleById(id)
  }
}
