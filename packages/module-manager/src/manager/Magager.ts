import Module from './modules/Module'
import { readdir, lstatSync } from 'fs'
import { join } from 'path'
import EventEmitter from 'events'

type ModuleId = string

type ModuleEntry = {
  module: Module
  enabled: boolean
  configuration?: any
}

export default class Manager extends EventEmitter {
  // private static instance: Manager

  private modules: Map<ModuleId, ModuleEntry> = new Map()

  // static getInstance(): Manager {
  //    if (!this.instance) {
  //       this.instance = new Manager()
  //    }
  //    return this.instance
  // }

  constructor(readonly modulesPath: string, readonly watch: boolean = true) {
    super()
    this.modulesPath = modulesPath
    this.watch = watch
  }

  async loadModulesFromPath() {
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
          }
        }
        resolve()
      })
    })
  }

  registerModule(id: string, module: Module) {
    module.init()

    // The pattern for emits is: <module-id>:<event-name>

    this.modules.set(id, {
      module,
      enabled: false,
    })
  }

  unregisterModule(id: string) {
    this.modules.delete(id)
  }

  enableModule(id: string) {
    const entry = this.modules.get(id)
    if (entry) {
      entry.enabled = true

      entry.module.on('update', (data) => {
        // console.log('Received update event from the module', id, data)
        this.emit(`event`, data)
      })

      entry.module.start()
    }
  }

  disableModule(id: string) {
    const entry = this.modules.get(id)
    if (entry) {
      entry.enabled = false
      entry.module.stop()
    }
  }

  start() {
    console.log('Starting modules', this.modules)
    this.modules.forEach((entry) => {
      this.enableModule(entry.module.name)
    })
  }

  stop() {
    this.modules.forEach((entry) => entry.module.stop())
  }

  getModules() {
    return Array.from(this.modules.values()).map((entry) => entry.module)
  }

  getModule(id: string): Module | null {
    return this.modules.get(id)?.module || null
  }

  receive(event: string) {
    const [moduleId, action] = event.split(':')
    const entry = this.modules.get(moduleId)

    if (entry) {
      entry.module.emit(action, {
        name: 'test',
      })
    } else {
      console.error('Module not found', moduleId)
    }
  }
}
