import EventManager from './EventManager'

/**
 * Define the event structure (sent by the server)
 */
export type RecEvent = {
  readonly id: string
  readonly render: string
  readonly error: string
}

export default class ModulesEventManager extends EventManager {
  private static URL = 'ws://localhost:3000/events'
  private static SCOPE = 'modules'
  private readonly observers: Map<string, (data: string) => void> = new Map()

  constructor() {
    super(ModulesEventManager.URL, ModulesEventManager.SCOPE)
  }

  get(id: string, callback: (data: string) => void) {
    console.log('Subscribing to module', id, this.observers.has(id))
    if (this.observers.has(id)) {
      console.log('Already subscribed to module', id)
      return
    }

    this.observers.set(id, callback)
    this.subscribe(callback)
    this.send({
      type: 'module',
      action: 'subscribe',
      id,
    })
  }

  release(id: string) {
    const obsCallback = this.observers.get(id)
    if (!obsCallback) {
      return
    }

    this.unsubscribe(obsCallback)
    this.observers.delete(id)

    this.send({
      type: 'module',
      action: 'unsubscribe',
      id,
    })
  }

  protected onReceive(data: any) {
    const module = JSON.parse(data.data) as RecEvent
    const obsCallback = this.observers.get(module.id)
    if (obsCallback) {
      obsCallback(module.render || module.error)
    }
  }
}
