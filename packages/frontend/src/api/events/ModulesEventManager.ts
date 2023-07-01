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
 * Define the event structure (sent by the server)
 */
export type RecEvent = {
  readonly id: string
  readonly render: string
  readonly error: string
}

export default class ModulesEventManager {
  private readonly emitter = new EventEmitter()
  protected conn!: WebSocket
  private readonly observers: Map<string, Set<(data: { render?: string; error?: string }) => void>> = new Map()
  private static URL = 'ws://localhost:3000/events'
  private static SCOPE = 'modules'

  constructor() {
    this.conn = new WebSocket(ModulesEventManager.URL)
    this.conn.onmessage = (event) => {
      this.onReceive(event)
    }
  }

  get(id: string, callback: (data: { render?: string; error?: string }) => void) {
    let observerCallbacks = this.observers.get(id)

    if (!observerCallbacks) {
      observerCallbacks = new Set()
      this.observers.set(id, observerCallbacks)
    }

    observerCallbacks.add(callback)

    this.emitter.on(ModulesEventManager.SCOPE, callback)

    this.conn.send(
      JSON.stringify({
        type: 'module',
        action: 'subscribe',
        id,
      }),
    )
  }

  release(id: string, callback: (data: { render?: string; error?: string }) => void) {
    const observerCallbacks = this.observers.get(id)
    if (!observerCallbacks) {
      return
    }

    observerCallbacks.delete(callback)

    this.emitter.off(ModulesEventManager.SCOPE, callback)

    if (observerCallbacks.size === 0) {
      this.observers.delete(id)

      this.conn.send(
        JSON.stringify({
          type: 'module',
          action: 'unsubscribe',
          id,
        }),
      )
    }
  }

  protected onReceive(data: MessageEvent) {
    const module = JSON.parse(data.data) as RecEvent
    const observerCallbacks = this.observers.get(module.id)
    if (observerCallbacks) {
      observerCallbacks.forEach((callback) => {
        callback({
          render: module.render,
          error: module.error,
        })
      })
    }
  }

  close() {
    this.emitter.removeAllListeners()
    this.conn.close()
  }
}
