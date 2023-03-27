import Module from '../modules/Module'

export default class Hello extends Module {
  init(): this {
    console.log('init hello')
    return this
  }
  start(): void {
    console.log('init hello')
  }
  stop(): void {
    console.log('init hello')
  }
  name = 'Hello'
  description = 'A simple module that says hello'
  version = '1.0.0'
  render() {
    return 'Hello World'
  }
}
