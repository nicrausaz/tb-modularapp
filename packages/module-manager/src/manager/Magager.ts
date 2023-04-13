import Module from './modules/Module'
import { readdir, lstatSync } from 'fs'
import { join } from 'path'
import EventEmitter from 'events'
import { randomUUID } from 'crypto'
import { SpecificConfiguration, specificConfigurationReader } from './modules/configuration/SpecificConfiguration'
import { Configuration } from './modules/Configuration'

type ModuleId = string

type ModuleEntry = {
  module: Module
  enabled: boolean
  currentConfiguration: SpecificConfiguration
}

export default class Manager extends EventEmitter {
  // private static instance: Manager

  private static readonly CONFIG_FILENAME = 'config.json'

  private modules: Map<ModuleId, ModuleEntry> = new Map()

  // static getInstance(): Manager {
  //    if (!this.instance) {
  //       this.instance = new Manager()
  //    }
  //    return this.instance
  // }

  constructor(private readonly modulesPath: string, private readonly watch: boolean = true) {
    super()
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
            this.loadModule(join(this.modulesPath, file))
          }
        }
        resolve()
      })
    })
  }

  /**
   * Register a new module to the manager
   * The default configuration of the module will be loader
   */
  registerModule(id: string, module: Module /*, config: SpecificConfiguration */) {
    module.init()
    this.modules.set(id, {
      module,
      enabled: false,
      currentConfiguration: module.defaultConfig(),
    })
  }

  unregisterModule(id: string) {
    this.modules.delete(id)
  }

  enableModule(id: string) {
    const entry = this.modules.get(id)
    if (entry) {
      entry.enabled = true

      entry.module.on('update', (data: any) => {
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

  /**
   * Load a module, its configuration and registrers it into the manager
   */
  private async loadModule(path: string) {
    // Generate a random id for the module entry
    const id = randomUUID()

    // Load the module
    const module = await import(path)

    // Load the configuration
    const config = (await import(join(path, Manager.CONFIG_FILENAME))).default

    // Load the specific configuration
    const specific = specificConfigurationReader(config.specificConfig)

    // Build the module configuration
    const configuration = new Configuration(
      config.name,
      config.description,
      config.version,
      config.author,
      config.specificConfig,
    )

    // Load the configuration into the module
    const moduleInstance = new module.default(configuration)

    this.registerModule(id, moduleInstance)

    // console.log(specific)
    // console.log(specific.toArray())

    // Load the configuration type
    // const ConfigType = (await import(join(path, 'config-type.ts.d'))).default

    // Build the configuration / TODO type
    /*
    const configuration = new Configuration<SpecificConfiguration>(
      config.name,
      config.description,
      config.version,
      config.author,
      config.specificConfig,
    )

    // Register the module
    
    */
  }
}
