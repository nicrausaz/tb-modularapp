import BaseAccessor from './BaseAccessor'

/**
 * KeyboardAccessor
 *
 * When a line is received, it is sent to the registered modules
 */
export default class KeyboardAccessor extends BaseAccessor {
  constructor() {
    super('keyboard')
  }

  public send<T>() {}

  public run() {
    process.stdin.on('data', (data) => {
      const stringData = data.toString('utf8').trim()
      console.log('data from keyboard accessor', stringData)
      this.sendToAll(stringData)
    })
    process.stdin.on('error', (error) => {
      console.error("Erreur d'entrée standard :", error)
    })

    // process.on('exit', () => this.stop())

    process.stdin.resume()
  }

  public stop() {
    process.stdin.pause()
  }
}
