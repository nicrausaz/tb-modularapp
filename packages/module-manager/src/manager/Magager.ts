import Module from './modules/Module'
import { readdir, lstatSync } from 'fs'
import { join } from 'path'
import Hello from './prebuilt/Hello'

type ModuleId = string

type ModuleEntry = {
  module: Module
  enabled: boolean
  configuration?: any
}

export default class Manager {
  // private static instance: Manager

  private activeModules: Map<ModuleId, ModuleEntry> = new Map()

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

  loadModulesFromPath() {
    readdir(this.modulesPath, (err, files) => {
      if (err) {
        console.error(err)
        return
      }

      files.forEach((file) => {
        if (lstatSync(join(this.modulesPath, file)).isDirectory()) {
          const module = new Hello()
          this.registerModule(file, module)
        }
      })
    })
  }

  registerModule(id: string, module: Module) {
    this.activeModules.set(id, {
      module,
      enabled: true,
    })
  }

  unregisterModule(id: string) {
    this.activeModules.delete(id)
  }

  start() {
    this.activeModules.forEach((entry) => entry.module.start())
  }

  stop() {
    this.activeModules.forEach((entry) => entry.module.stop())
  }

  getModules() {
    return Array.from(this.activeModules.values()).map((entry) => entry.module)
  }
}
