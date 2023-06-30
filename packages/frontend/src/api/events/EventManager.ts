import EventEmitter from 'events'

/**
 * Define the event structure (From client to server)
 */
export type Event = {
  readonly type: 'module' | 'screen'
  readonly action: string
  readonly id: string
}

/**
 * Manage WebSockets events
 */
export default abstract class EventManager {
  private readonly emitter = new EventEmitter()
  protected conn!: WebSocket

  // TODO Liste de subscriptions ici ?

  constructor(private readonly url: string, private readonly scope: string) {
    this.conn = new WebSocket(this.url)
    this.conn.onmessage = (event) => {
      this.onReceive(event)
    }
  }

  subscribe<T>(callback: (data: T) => void) {
    this.emitter.on(this.scope, callback)
  }

  unsubscribe<T>(callback: (data: T) => void) {
    this.emitter.off(this.scope, callback)
  }

  protected emit(data: any) {
    this.emitter.emit(this.scope, data)
  }

  send(data: Event) {
    this.conn.send(JSON.stringify(data))
  }

  close() {
    this.emitter.removeAllListeners()
    this.conn.close()
  }

  protected abstract onReceive(data: object): void
}
