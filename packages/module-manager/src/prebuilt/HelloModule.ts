import Module from '../manager/modules/Module'

export class HelloModule extends Module {
  name: string = 'HelloModule'
  description: string = 'A simple module that says hello'
  version: string = '1.0.0'

  init(): this {
    console.log('Init from HelloModule')
    return this
  }

  start(): void {
    console.log('Start from HelloModule')
  }

  stop(): void {
    console.log('Stop from HelloModule')
  }

  render(): string {
    return `<h1>Hello from HelloModule!</h1>`
  }
}
