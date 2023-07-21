import { Module, ModuleProps } from '@yalk/module'

export interface HelloModuleProps extends ModuleProps {
  name: string
  last: string
}

export interface HelloModuleReceiveProps extends ModuleProps {
  message: string
}

export default class HelloModule extends Module {
  lastReceivedData!: string

  init(): void {
    console.log('Debug module initialized')
  }

  destroy(): void {
    console.log('Debug module destroyed')
  }

  start(): void {
    console.log('Debug module started')

    setInterval(() => {
      this.notify({
        name: this.getEntryValue<string>('message'),
        last: this.lastReceivedData,
      })
    }, this.getEntryValue<number>('refreshRate'))
  }

  stop(): void {
    console.log('Debug module stopped')
  }

  onReceive(type: string, data: HelloModuleReceiveProps): void {
    console.log('The module hello received', data)
    this.lastReceivedData = data.message
  }

  onNewSubscriber(): void {
    // Nothing to do here
  }
}
