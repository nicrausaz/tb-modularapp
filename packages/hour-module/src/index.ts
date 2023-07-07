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
    clearInterval(this.interval)
  }

  onReceive(type: string, data: ModuleProps): void {
    // Nothing to do here
    console.log('HOUR MODULE, received:', type, data)
  }

  onNewSubscriber(): void {
    // Nothing to do here
  }
}
