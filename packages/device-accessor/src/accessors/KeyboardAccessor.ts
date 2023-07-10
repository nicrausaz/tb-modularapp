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

  public send() {
    // Nothing can be sent to the keyboard
  }

  public run() {
    process.stdin.on('data', (data) => {
      this.sendToAll(data.toString('utf8').trim())
    })
    process.stdin.on('error', (error) => {
      console.error("Erreur d'entrée standard :", error)
    })

    process.stdin.resume()
  }

  public stop() {
    process.stdin.pause()
  }
}
