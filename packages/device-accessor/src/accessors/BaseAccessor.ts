import { Module } from '@yalk/module'
// import EventEmitter from 'events'

export default abstract class BaseAccessor {
  // private emitter = new EventEmitter()
  protected registeredModules: Array<{ id: string; module: Module }> = []

  protected constructor(private typeKey: string) {}

  public require(module: Module, moduleId: string) {
    this.registeredModules.push({
      id: moduleId,
      module,
    })
  }

  public release(moduleId: string) {
    this.registeredModules = this.registeredModules.filter((m) => m.id !== moduleId)
  }

  /**
   * Send data using the accessor's protocol
   * @param data data to send
   */
  public abstract send<T>(...args: any[]): any

  public receive(moduleId: string, data: any) {
    // const module = this.registeredModules.find((m) => m.id === moduleId)
    // if (!module) {
    //   throw new Error(`Module ${moduleId} not found`)
    // }
    // module.receiveData(this.typeKey, data)
  }

  public abstract run(): void

  public abstract stop(): void

  get type(): string {
    return this.typeKey
  }

  protected sendToAll(data: any) {
    this.registeredModules.forEach((entry) => {
      entry.module.receiveData(this.typeKey, data)
    })
  }

  // protected sendTo(moduleId: any) {
  //   const module = this.registeredModules.find((m) => m.id === moduleId)
  //   if (!module) {
  //     throw new Error(`Module ${moduleId} not found`)
  //   }
  //   module.receiveData(this.typeKey, data)
  // }
}
