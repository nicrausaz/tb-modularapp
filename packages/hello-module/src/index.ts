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
    this.notify<HelloModuleProps>({
      name: 'Nicolas',
    })
  }

  stop(): void {
    this.removeAllListeners()
  }
}
