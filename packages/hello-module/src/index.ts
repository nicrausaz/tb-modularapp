import { Module } from '@yalk/module-manager'

export default class HelloModule extends Module {
  name = 'hello-module'
  description = 'A simple module that says hello'
  version = '1.0.0'

  private hello = 'Hello World! from module'

  private interval!: NodeJS.Timer

  init(): this {
    console.log('Init from the HelloModule!')
    return this
  }

  start(): void {
    console.log('Start from the HelloModule!')
    this.interval = setInterval(() => {
      console.log('update')
      this.emit('update', this.hello + ' ' + new Date().toISOString())
    }, 3000)

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
    return ""
  }
}
