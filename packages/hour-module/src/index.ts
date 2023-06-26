import { Module, ModuleProps } from '@yalk/module'

export interface HourModuleProps extends ModuleProps {
  date: string
}

export default class HourModule extends Module {
  private interval!: NodeJS.Timer

  init(): void {
    // Nothing to do here
  }

  destroy(): void {
    // Nothing to do here
  }

  start(): void {
    this.interval = setInterval(() => {
      this.notify<HourModuleProps>({
        date: new Date().toLocaleString(),
      })
    }, this.getEntryValue<number>('refreshRate'))
  }

  stop(): void {
    console.log('Stop from the HelloModule!')
    clearInterval(this.interval)
    this.removeAllListeners()
  }

  onReceive(data: ModuleProps): void {
    // Nothing to do here
  }

  onNewSubscriber(): void {
    // Nothing to do here
  }
}
