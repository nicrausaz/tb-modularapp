import Module from "./modules/Module"

type ModuleId = string

export default class Manager {
   private static instance: Manager

   private activeModules: Map<ModuleId, Module> = new Map()

   static getInstance(): Manager {
      if (!this.instance) {
         this.instance = new Manager()
      }
      return this.instance
   }

   private constructor() {}

   registerModule(id: string, module: Module) {
      this.activeModules.set(id, module)
   }

   unregisterModule(module: Module) {
      this.activeModules.delete(module.name)
   }

   start() {
      this.activeModules.forEach((module) => module.start())
   }

   stop() {
      this.activeModules.forEach((module) => module.stop())
   }
}
