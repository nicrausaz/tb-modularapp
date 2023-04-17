import { Module } from '@yalk/module'

export default class HelloModule extends Module {
  private interval!: NodeJS.Timer

  init(): this {
    console.log('Init from the HelloModule!')
    return this
  }

  destroy(): void {
    console.log('Destroyed the HelloModule!')
  }

  start(): void {
    console.log('Start from the HelloModule!', this.getEntryValue<number>('refreshRate'))

    this.interval = setInterval(() => {
      this.emit('update', this.getEntryValue('message'))
    }, this.getEntryValue<number>('refreshRate'))

    this.on('create', (data) => {
      console.log('Received create event from the HelloModule!', data)
    })
  }

  stop(): void {
    console.log('Stop from the HelloModule!')
    clearInterval(this.interval)
    this.removeAllListeners()
  }
}
