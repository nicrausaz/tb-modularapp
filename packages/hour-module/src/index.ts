import { Module, ModuleProps } from '@yalk/module'

export interface HourModuleProps extends ModuleProps {
  date: string
}

export default class HourModule extends Module {
  private interval!: NodeJS.Timer

  init(): this {
    return this
  }

  destroy(): void {
    // Nothing to do here
  }

  start(): void {
    this.interval = setInterval(() => {
      this.emit('update', {
        date: new Date().toLocaleString(),
      })
    }, this.getEntryValue<number>('refreshRate'))

    // this.on('create', (data) => {
    //   console.log('Received create event from the HelloModule!', data)
    // })
  }

  stop(): void {
    console.log('Stop from the HelloModule!')
    clearInterval(this.interval)
    this.removeAllListeners()
  }
}
