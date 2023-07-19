import {
  Configuration,
  Module,
  ModuleProps,
  SpecificConfiguration,
  SpecificConfigurationEntryTypeValue,
  ModuleValidationSchema,
} from '@yalk/module'
import { BaseAccessor, HTTPAccessor, KeyboardAccessor } from '@yalk/device-accessor'
import { readdir, lstatSync, existsSync, rmSync } from 'fs'
import { join } from 'path'
import Ajv from 'ajv'

type ModuleId = string

type ModuleEntry = {
  module: Module
  enabled: boolean
  onSend: (type: string, data: any) => void
}

export type ManagerEntry = {
  id: ModuleId
  module: Module
  enabled: boolean
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
  private accessors: Map<string, BaseAccessor> = new Map()

  constructor(private readonly modulesPath: string) {
    const http = new HTTPAccessor()
    const keyb = new KeyboardAccessor()

    this.accessors.set(http.type, new HTTPAccessor())
    this.accessors.set(keyb.type, new KeyboardAccessor())

    this.accessors.forEach((a) => a.run())
  }

  /**
   * Read the manager directory to find modules and load them
   */
  async loadModulesFromPath(): Promise<void> {
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
   * @param id module id
   * @param module module instance
   * @returns true if the module was registered, false otherwise (error occurred)
   */
  registerModule(id: ModuleId, module: Module): boolean {
    try {
      module.init()
      this.modules.set(id, {
        module,
        enabled: false,
        onSend: (type: string, data: any) => {
          this.redirectDataToAccessors(id, type, data)
        },
      })
      return true
    } catch (_) {
      return false
    }
  }

  /**
   * Unregister a module from the manager
   * The module will be stopped if it is running and removed from the manager
   * @param id module id
   * @throws ModuleNotFoundError if the module is not registered
   * @returns true if the module was unregistered, false otherwise (error occurred)
   */
  unregisterModule(id: ModuleId): boolean {
    const entry = this.getEntryOrThrow(id)

    if (entry.enabled && !this.disableModule(id)) {
      return false
    }

    try {
      this.modules.delete(id)
      this.deleteModule(id)
      return true
    } catch (_) {
      return false
    }
  }

  /**
   * Enable a module, if it is not already enabled.
   * The module will be started
   * @param id module id
   * @throws ModuleNotFoundError if the module is not registered
   */
  enableModule(id: ModuleId): boolean {
    const entry = this.getEntryOrThrow(id)

    if (entry.enabled) {
      return false
    }

    try {
      entry.module.start()
      entry.enabled = true
      this.requireModuleAccessors(entry.module, id)
      entry.module.registerToSend(entry.onSend)
      return true
    } catch (_) {
      return false
    }
  }

  /**
   * Disable a module, if it is not already disabled.
   * The module will be stopped
   * @param id module id
   * @throws ModuleNotFoundError if the module is not registered
   */
  disableModule(id: ModuleId): boolean {
    const entry = this.getEntryOrThrow(id)

    if (!entry.enabled) {
      return false
    }

    try {
      entry.module.stop()
      entry.enabled = false
      entry.module.unregisterFromSend(entry.onSend)
      this.releaseModuleAccessors(entry.module, id)
      return true
    } catch (_) {
      return false
    }
  }

  /**
   * Start all the modules
   */
  start(): void {
    this.modules.forEach((_, key) => this.enableModule(key))
  }

  /**
   * Stop all the modules and release their accessors
   */
  stop(): void {
    this.modules.forEach((_, id) => this.disableModule(id))
    this.accessors.forEach((a) => a.run())
  }

  /**
   * Get all the registered modules
   * @returns Array of registered modules
   */
  getModules(): ManagerEntry[] {
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
  getModule(id: ModuleId): ManagerEntry {
    const entry = this.getEntryOrThrow(id)
    return {
      id,
      module: entry.module,
      enabled: entry.enabled,
    }
  }

  /**
   * Check if a module is registered
   * @param id module id
   * @returns true if the module is registered, false otherwise
   */
  moduleExists(id: ModuleId): boolean {
    return this.modules.has(id)
  }

  /**
   * Subscribe to a module update event
   * @param moduleId the module id to subscribe to
   * @param callback the callback to call when the module is updated
   * @throws ModuleNotFoundError if the module is not registered
   */
  subscribeTo(moduleId: ModuleId, callback: (render: string) => void): void {
    this.getModule(moduleId).module.registerToUpdates(callback)
  }

  /**
   * Unsubscribe from a module update event
   * @param moduleId
   * @param callback
   */
  unsubscribeFrom(moduleId: ModuleId, callback: (render: string) => void): void {
    this.getModule(moduleId).module.unregisterFromUpdates(callback)
  }

  /**
   * Send data to a module if the module has access to the http accessor
   * @param moduleId module id
   * @param data data to send
   */
  sendDataTo(moduleId: ModuleId, data: unknown): void {
    const entry = this.getModule(moduleId)
    const accessor = this.accessors.get('http')

    if (!accessor || !accessor.hasAccess(entry.id)) {
      throw new ModuleHTTPAccessorDenied(entry.id)
    }

    accessor.transmitTo(entry.id, data)
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
  ): void {
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
    const modulePath = join(this.modulesPath, filename)

    try {
      // Load the module
      const module = await import(join(modulePath, Manager.MODULE_ENTRY_FILENAME))

      // Load the configuration
      const config = (await import(join(modulePath, Manager.CONFIG_FILENAME))).default

      // Validate the configuration
      if (!this.configValidation(config)) {
        throw new Error('Invalid configuration schema')
      }

      // Load the specific configuration
      const specific = SpecificConfiguration.fromObject(config.specificConfig)

      // Build the module configuration
      const configuration = new Configuration(
        config.name,
        config.description,
        config.version,
        config.author,
        config.icon,
        config.requires,
        specific,
      )

      // Load the renderer
      const renderer = new (await import(join(modulePath, Manager.MODULE_RENDERED_FILENAME))).default()

      // Load the configuration into the module and register it
      this.registerModule(id, new module.default(configuration, renderer))
      return true
    } catch (e) {
      console.error(`Module '${filename}', was not loaded because it has invalid structure: ${e}`)
      return false
    }
  }

  /**
   * Delete a module from the file system
   * @param filename module id (matches the folder name)
   */
  private deleteModule(moduleId: ModuleId): void {
    const modulePath = join(this.modulesPath, moduleId)

    if (!existsSync(modulePath)) {
      throw new Error('Module sources not found')
    }

    rmSync(modulePath, { recursive: true })
  }

  /**
   * Acquire the required accessors for a module
   * @param module module to acquire accessors for
   * @param moduleId module id to acquire accessors for
   */
  private requireModuleAccessors(module: Module, moduleId: ModuleId): void {
    const requires = module.requires

    if (!requires || requires.length === 0) {
      return
    }

    for (const required of requires) {
      const accessor = this.accessors.get(required)

      if (!accessor) {
        throw new Error(`Module '${module.name}' requires invalid accessor '${required}'`)
      }

      accessor.require(module, moduleId)
    }
  }

  /**
   * Release the required accessors for a module
   * @param module module to release accessors for
   * @param moduleId module id to release accessors for
   */
  private releaseModuleAccessors(module: Module, moduleId: ModuleId): void {
    const requires = module.requires

    if (!requires || requires.length === 0) {
      return
    }

    for (const required of requires) {
      const accessor = this.accessors.get(required)

      if (!accessor) {
        throw new Error(`Module '${module.name}' requires invalid accessor '${required}'`)
      }

      accessor.release(moduleId)
    }
  }

  /**
   * Validate the JSON configuration against the schema
   * @param config configuration to validate
   * @returns true if the configuration is valid, false otherwise
   */
  private configValidation(config: object): boolean {
    const ajv = new Ajv()
    const validate = ajv.compile(ModuleValidationSchema)
    return validate(config)
  }

  /**
   * Redirect data sent from a module to the corresponding accessor
   * @param id id of the module sending the data
   * @param type type of the accessor
   * @param data data to send
   */
  private redirectDataToAccessors(id: string, type: string, data: unknown): void {
    const accessor = this.accessors.get(type)
    if (!accessor) {
      console.error('No accessor found for type', type)
      return
    }

    if (!accessor.hasAccess(id)) {
      console.error(`Module '${id}' is not allowed to receive data from accessor '${type}'`)
      return
    }

    accessor.send(id, data)
  }
}

/**
 * Error thrown when a module is not found.
 */
export class ModuleNotFoundError extends Error {
  constructor(moduleId: ModuleId) {
    super(`Module with id '${moduleId}' not found`)
  }
}

/**
 * Error thrown when a module is not allowed to receive HTTP data through the API.
 */
export class ModuleHTTPAccessorDenied extends Error {
  constructor(moduleId: ModuleId) {
    super(`Module '${moduleId}' is not allowed to receive HTTP data`)
  }
}
