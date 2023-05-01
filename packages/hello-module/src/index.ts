import { Module, ModuleProps } from '@yalk/module'

export interface HelloModuleProps extends ModuleProps {
  name: string
}

export default class HelloModule extends Module {
  init(): void {
    // Nothing to do here
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

  onReceive(data: HelloModuleProps): void {
    console.log(data)
  }
}
