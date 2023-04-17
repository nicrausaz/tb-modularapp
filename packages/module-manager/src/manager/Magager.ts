import { Configuration, Module, SpecificConfiguration } from '@yalk/module'
import { readdir, lstatSync } from 'fs'
import { join } from 'path'
import EventEmitter from 'events'
import { randomUUID } from 'crypto'
// import { dirWatcher } from './helpers'

type ModuleId = string

type ModuleEntry = {
  module: Module
  enabled: boolean
}

export default class Manager extends EventEmitter {
  private static readonly MODULE_ENTRY_FILENAME = 'index.js'
  private static readonly CONFIG_FILENAME = 'config.json'
  private static readonly MODULE_RENDERED_FILENAME = 'app.js'

  private modules: Map<ModuleId, ModuleEntry> = new Map()

  constructor(private readonly modulesPath: string, private readonly watch: boolean = true) {
    super()
    if (watch) {
      // console.log('Watching for changes in the modules folder ...')
      // this.bindFolderWatcher()
    }
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
            await this.loadModule(join(this.modulesPath, file))
          }
        }
        resolve()
      })
    })
  }

  /**
   * Register a new module to the manager
   * The module will be initialized first
   */
  registerModule(id: ModuleId, module: Module) {
    module.init()
    this.modules.set(id, {
      module,
      enabled: false,
    })
  }

  /**
   * Unregister a module from the manager
   * The module will be stopped, removed from the manager and deleted from the module folder
   * @param id
   */
  unregisterModule(id: ModuleId) {
    this.modules.delete(id)
  }

  enableModule(id: ModuleId) {
    const entry = this.modules.get(id)
    if (entry) {
      entry.enabled = true
      // entry.module.on('update', (data: any) => {
      //   // console.log('Received update event from the module', id, data)
      //   this.emit(`event`, data)
      // })

      entry.module.start()
    }
  }

  disableModule(id: ModuleId) {
    const entry = this.modules.get(id)
    if (entry) {
      entry.enabled = false
      entry.module.stop()
      // entry.module.off('update')
    }
  }

  start() {
    this.modules.forEach((_, key) => {
      this.enableModule(key)
    })
  }

  stop() {
    this.modules.forEach((entry) => entry.module.stop())
  }

  getModules() {
    return Array.from(this.modules).map(([key, entry]) => {
      return {
        id: key,
        name: entry.module.name,
        description: entry.module.description,
        version: entry.module.version,
        author: entry.module.author,
        enabled: entry.enabled,
      }
    })
  }

  getModule(id: ModuleId): Module | null {
    return this.modules.get(id)?.module || null
  }

  private bindFolderWatcher() {
    // dirWatcher(this.modulesPath)
  }

  /**
   * Load a module, its configuration and registrers it into the manager
   */
  private async loadModule(path: string) {
    // Generate a random id for the module entry
    const id = randomUUID()

    // Load the module
    const module = await import(join(path, Manager.MODULE_ENTRY_FILENAME))

    // Load the configuration
    const config = (await import(join(path, Manager.CONFIG_FILENAME))).default

    // Load the specific configuration
    const specific = SpecificConfiguration.fromObject(config.specificConfig)

    // Build the module configuration
    const configuration = new Configuration(config.name, config.description, config.version, config.author, specific)

    // Load the renderer
    const renderer = new (await import(join(path, Manager.MODULE_RENDERED_FILENAME))).default()

    // Load the configuration into the module and register it
    this.registerModule(id, new module.default(configuration, renderer))
  }
}
