import { Module, ModuleProps } from '@yalk/module'

export interface HelloModuleProps extends ModuleProps {
  name: string
}

export default class HelloModule extends Module {
  init(): this {
    return this
  }

  destroy(): void {
    // Nothing to do here
  }

  start(): void {
    this.emit('update', {
      name: 'Nicolas',
    })
  }

  stop(): void {
    this.removeAllListeners()
  }
}
