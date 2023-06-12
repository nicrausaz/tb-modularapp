import {
  Configuration,
  Module,
  ModuleProps,
  SpecificConfiguration,
  SpecificConfigurationEntryTypeValue,
} from '@yalk/module'
import { readdir, lstatSync, existsSync, rmSync } from 'fs'
import { join } from 'path'

type ModuleId = string

type ModuleEntry = {
  module: Module
  enabled: boolean
}

type ModuleStateEntry = ModuleEntry & {
  id: ModuleId
}

/**
 * The module manager is responsible for loading, starting and stopping modules and their configuration.
 * It is the entry point to access the modules and their events.
 */
export default class Manager {
  private static readonly MODULE_ENTRY_FILENAME = 'index.js'
  private static readonly CONFIG_FILENAME = 'config.json'
  private static readonly MODULE_RENDERED_FILENAME = 'app.js'

  private modules: Map<ModuleId, ModuleEntry> = new Map()

  constructor(private readonly modulesPath: string) {}

  async loadModulesFromPath() {
    return new Promise<void>((resolve, reject) => {
      readdir(this.modulesPath, async (err, files) => {
        if (err) {
          reject(err)
          return
        }

        for await (const file of files) {
          if (lstatSync(join(this.modulesPath, file)).isDirectory()) {
            await this.loadModule(file)
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
   * The module will be stopped if it is running and removed from the manager
   * @param id module id
   * @throws ModuleNotFoundError if the module is not registered
   */
  unregisterModule(id: ModuleId) {
    const entry = this.getEntryOrThrow(id)

    if (entry.enabled) {
      this.disableModule(id)
    }

    this.modules.delete(id)
    this.deleteModule(id)
  }

  /**
   * Enable a module, if it is not already enabled.
   * The module will be started
   * @param id module id
   * @throws ModuleNotFoundError if the module is not registered
   */
  enableModule(id: ModuleId) {
    const entry = this.getEntryOrThrow(id)

    if (!entry.enabled) {
      entry.enabled = true
      entry.module.start()
    }
  }

  /**
   * Disable a module, if it is not already disabled.
   * The module will be stopped
   * @param id module id
   * @throws ModuleNotFoundError if the module is not registered
   */
  disableModule(id: ModuleId) {
    const entry = this.getEntryOrThrow(id)

    if (entry.enabled) {
      entry.enabled = false
      entry.module.stop()
    }
  }

  /**
   * Start all the modules
   */
  start() {
    this.modules.forEach((_, key) => this.enableModule(key))
  }

  /**
   * Stop all the modules
   */
  stop() {
    this.modules.forEach((_, id) => this.disableModule(id))
  }

  /**
   * Get all the registered modules
   * @returns Array of registered modules
   */
  getModules(): ModuleStateEntry[] {
    return Array.from(this.modules).map(([key, entry]) => {
      return {
        id: key,
        module: entry.module,
        enabled: entry.enabled,
      }
    })
  }

  /**
   * Get a module by its id
   * @param id
   * @returns the module
   * @throws ModuleNotFoundError if the module is not registered
   */
  getModule(id: ModuleId): { module: Module; enabled: boolean } {
    const entry = this.getEntryOrThrow(id)
    return {
      module: entry.module,
      enabled: entry.enabled,
    }
  }

  /**
   * Subscribe to a module update event
   * @param moduleId the module id to subscribe to
   * @param callback the callback to call when the module is updated
   * @throws ModuleNotFoundError if the module is not registered
   */
  subscribeTo(moduleId: ModuleId, callback: (data: ModuleProps) => void) {
    this.getModule(moduleId).module.on('update', callback)
  }

  /**
   * Unsubscribe from a module update event
   * @param moduleId
   * @param callback
   */
  unsubscribeFrom(moduleId: ModuleId, callback: (data: ModuleProps) => void) {
    this.getModule(moduleId).module.off('update', callback)
  }

  /**
   * Set the configuration of a module. Only the specified existing keys will be updated.
   * @param moduleId module id
   * @param configuration configuration to set
   */
  setConfiguration(
    moduleId: ModuleId,
    configuration: Array<{
      name: string
      value: SpecificConfigurationEntryTypeValue
    }>,
  ) {
    const module = this.getEntryOrThrow(moduleId).module
    module.setConfiguration(configuration)
  }

  /**
   * Get a module entry or throw an error if it is not registered
   * @param id module id
   * @returns module entry
   */
  private getEntryOrThrow(id: ModuleId): ModuleEntry {
    const entry = this.modules.get(id)

    if (!entry) {
      throw new ModuleNotFoundError(id)
    }
    return entry
  }

  /**
   * Load a module, its configuration and registers it into the manager
   */
  async loadModule(filename: string): Promise<boolean> {
    const id = filename

    // if (this.modules.has(id)) {
    //   console.log(`Module '${filename}', already loaded. Ignoring`)
    //   return false
    // }

    const modulePath = join(this.modulesPath, filename)

    try {
      // Load the module
      const module = await import(join(modulePath, Manager.MODULE_ENTRY_FILENAME))

      // Load the configuration
      const config = (await import(join(modulePath, Manager.CONFIG_FILENAME))).default

      // Load the specific configuration
      const specific = SpecificConfiguration.fromObject(config.specificConfig)

      // Build the module configuration
      const configuration = new Configuration(config.name, config.description, config.version, config.author, specific)

      // Load the renderer
      const renderer = new (await import(join(modulePath, Manager.MODULE_RENDERED_FILENAME))).default()

      // Load the configuration into the module and register it
      this.registerModule(id, new module.default(configuration, renderer))
      return true
    } catch (e) {
      console.log(`Module '${filename}', was not loaded because it has invalid structure: ${e}`)
      return false
    }
  }

  private deleteModule(filename: string) {
    const modulePath = join(this.modulesPath, filename)

    if (!existsSync(modulePath)) {
      throw new Error('Module sources not found')
    }

    rmSync(modulePath, { recursive: true })
  }
}

/**
 * Error thrown when a module is not found
 */
export class ModuleNotFoundError extends Error {
  constructor(moduleId: ModuleId) {
    super(`Module with id '${moduleId}' not found`)
  }
}
