import { Module } from '@yalk/module-manager'

export default class HelloModule extends Module {
  private interval!: NodeJS.Timer

  init(): this {
    console.log('Init from the HelloModule!')
    return this
  }

  start(): void {
    console.log('Start from the HelloModule!')

    this.interval = setInterval(() => {
      console.log('update', this.getEntry('message'))
      this.emit('update', this.getEntry('message'))
    }, this.getEntry<number>('refreshRate'))

    this.on('create', (data) => {
      console.log('Received create event from the HelloModule!', data)
    })
  }

  stop(): void {
    console.log('Stop from the HelloModule!')
    clearInterval(this.interval)
    this.removeAllListeners()
  }

  render() {
    return ''
  }
}
