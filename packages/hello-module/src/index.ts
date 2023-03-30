import { Module } from '@yalk/module-manager'

export default class HelloModule extends Module {
  name = 'hello-module'
  description = 'A simple module that says hello'
  version = '1.0.0'

  private _hello!: string

  private interval!: NodeJS.Timer

  init(): this {
    console.log('Init from the HelloModule!')
    this._hello = 'Hello World after init!'
    return this
  }

  start(): void {
    console.log('Start from the HelloModule!')
    this.interval = setInterval(() => {
      console.log(this._hello)
    }, 3000)
  }

  stop(): void {
    console.log('Stop from the HelloModule!')
    clearInterval(this.interval)
  }

  render() {
    return ""
  }
}
