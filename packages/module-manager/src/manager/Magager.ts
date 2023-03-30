import Module from './modules/Module'
import { readdir, lstatSync } from 'fs'
import { join } from 'path'

type ModuleId = string

type ModuleEntry = {
  module: Module
  enabled: boolean
  configuration?: any
}

export default class Manager {
  // private static instance: Manager

  private modules: Map<ModuleId, ModuleEntry> = new Map()

  // static getInstance(): Manager {
  //    if (!this.instance) {
  //       this.instance = new Manager()
  //    }
  //    return this.instance
  // }

  constructor(readonly modulesPath: string, readonly watch: boolean = true) {
    this.modulesPath = modulesPath
    this.watch = watch
  }

  async loadModulesFromPath() {
    console.log("Loading modules from path", this.modulesPath)
    return new Promise<void>((resolve, reject) => {
      readdir(this.modulesPath, async (err, files) => {
        if (err) {
          reject(err)
          return
        }
  
        for await (const file of files) {
          if (lstatSync(join(this.modulesPath, file)).isDirectory()) {
            const module = await import(join(this.modulesPath, file))
            this.registerModule(file, new module.default())
            console.log("Loaded module", file)
          }
        }
        console.log("Loaded modules done")
        resolve()
      })
    })
    
  }

  registerModule(id: string, module: Module) {
    module.init()

    this.modules.set(id, {
      module,
      enabled: false,
    })
  }

  unregisterModule(id: string) {
    this.modules.delete(id)
  }

  start() {
    console.log("Starting modules", this.modules)
    this.modules.forEach((entry) => entry.module.start())
  }

  stop() {
    this.modules.forEach((entry) => entry.module.stop())
  }

  getModules() {
    return Array.from(this.modules.values()).map((entry) => entry.module)
  }
}
