import EventEmitter from 'events'

/**
 * Define the event structure (From client to server)
 */
export type Event = {
  readonly type: string
  readonly action: string
  readonly id: string
}

/**
 * Define the event structure (sent by the server)
 */
export type RecEvent = {
  readonly type: string
  readonly id: string
  readonly subtype?: string
  readonly render?: string
  readonly error?: string
  readonly enabled?: boolean
}

export default class EventsManager {
  private readonly emitter = new EventEmitter()
  protected conn!: WebSocket
  private static URL = 'ws://localhost:3000/events'

  private readonly modulesObservers: Map<string, Set<(data: RecEvent) => void>> = new Map()
  private readonly screensObservers: Map<number, Set<(data: any) => void>> = new Map()

  constructor() {
    this.conn = new WebSocket(EventsManager.URL)
    this.conn.onmessage = (event) => {
      this.onReceive(event)
    }
    this.conn.onclose = () => {
      console.log('Connection closed')
    }

    this.conn.onerror = (err) => {
      console.error('Connection error', err)
    }
  }

  getModule(id: string, callback: (data: RecEvent) => void) {
    let observerCallbacks = this.modulesObservers.get(id)

    if (!observerCallbacks) {
      observerCallbacks = new Set()
      this.modulesObservers.set(id, observerCallbacks)
    }

    observerCallbacks.add(callback)

    this.emitter.on('modules', callback)

    this.getConn().then((c) =>
      c.send(
        JSON.stringify({
          type: 'module',
          action: 'subscribe',
          id,
        }),
      ),
    )
  }

  releaseModule(id: string, callback: (data: RecEvent) => void, sendUnsubscribe = true) {
    const observerCallbacks = this.modulesObservers.get(id)
    if (!observerCallbacks) {
      return
    }

    observerCallbacks.delete(callback)

    this.emitter.off('modules', callback)

    if (observerCallbacks.size === 0) {
      this.modulesObservers.delete(id)

      if (!sendUnsubscribe) {
        return
      }

      this.getConn().then((c) =>
        c.send(
          JSON.stringify({
            type: 'module',
            action: 'unsubscribe',
            id,
          }),
        ),
      )
    }
  }

  protected onReceive(data: MessageEvent) {
    const rec = JSON.parse(data.data) as RecEvent

    if (rec.type === 'module') {
      const observerCallbacks = this.modulesObservers.get(rec.id)
      if (observerCallbacks) {
        observerCallbacks.forEach((callback) => {
          callback(rec)
        })
      }
    } else if (rec.type === 'screen') {
      const observerCallbacks = this.screensObservers.get(parseInt(rec.id))
      if (observerCallbacks) {
        observerCallbacks.forEach((callback) => {
          callback(rec)
        })
      }
    }
  }

  getScreen(id: number, callback: (data: any) => void) {
    let observerCallbacks = this.screensObservers.get(id)

    if (!observerCallbacks) {
      observerCallbacks = new Set()
      this.screensObservers.set(id, observerCallbacks)
    }

    observerCallbacks.add(callback)
    this.emitter.on('screens', callback)

    this.getConn().then((c) =>
      c.send(
        JSON.stringify({
          type: 'screen',
          action: 'subscribe',
          id,
        }),
      ),
    )
  }

  releaseScreen(id: number, callback: (data: any) => void) {
    const observerCallbacks = this.screensObservers.get(id)
    if (!observerCallbacks) {
      return
    }

    observerCallbacks.delete(callback)

    this.emitter.off('screens', callback)

    if (observerCallbacks.size === 0) {
      this.screensObservers.delete(id)
      this.getConn().then((c) =>
        c.send(
          JSON.stringify({
            type: 'screen',
            action: 'unsubscribe',
            id,
          }),
        ),
      )
    }
  }

  close() {
    this.emitter.removeAllListeners()
    this.conn.close()
  }

  private getConn() {
    return new Promise<WebSocket>((resolve, reject) => {
      if (this.conn.readyState === WebSocket.OPEN) {
        resolve(this.conn)
      } else if (this.conn.readyState === WebSocket.CLOSED) {
        reject(new Error('WebSocket connection is closed.'))
      } else {
        this.conn.addEventListener('open', () => {
          resolve(this.conn)
        })
        this.conn.addEventListener('close', () => {
          reject(new Error('WebSocket connection is closed.'))
        })
      }
    })
  }
}
