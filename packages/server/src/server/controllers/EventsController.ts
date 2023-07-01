import WebSocket from 'ws'
import { ModulesService } from '../services'

type ModuleRecEvent = {
  id: string
  action: 'subscribe' | 'unsubscribe'
}

export default class EventsController {
  private readonly subscribers: Map<string, Set<(render: string) => void>> = new Map()

  constructor(private modulesService: ModulesService) {}

  handle(conn: WebSocket, data: ModuleRecEvent) {
    const moduleId = data.id

    if (data.action === 'subscribe') {
      this.subscribeToModule(conn, moduleId)
    } else if (data.action === 'unsubscribe') {
      this.unsubscribeFromModule(moduleId)
    }
  }

  private subscribeToModule(conn: WebSocket, moduleId: string) {
    const callback = (render: string) => {
      conn.send(
        JSON.stringify({
          id: moduleId,
          render,
        }),
      )
    }

    let moduleSubscribers = this.subscribers.get(moduleId)
    if (!moduleSubscribers) {
      moduleSubscribers = new Set()
      this.subscribers.set(moduleId, moduleSubscribers)
    }
    moduleSubscribers.add(callback)

    this.modulesService.subscribeToModuleEvents(moduleId, callback).catch(() => {
      conn.send(
        JSON.stringify({
          id: moduleId,
          error: 'Module is disabled',
        }),
      )
      moduleSubscribers?.delete(callback)
    })
  }

  unsubscribeFromModule(moduleId: string) {
    // const moduleSubscribers = this.subscribers.get(moduleId)
    // if (moduleSubscribers) {
    //   this.modulesService.unsubscribeFromModuleEvents(moduleId, callback)
    //   this.subscribers.delete(moduleId)
    // }
  }

  unsubscribeAll() {
    // this.subscribers.forEach((moduleSubscribers) => {
    //   moduleSubscribers.forEach((callback) => {
    //     // Unsubscribe from module events using callback
    //     this.modulesService.unsubscribeFromModuleEvents(moduleId, callback)
    //   })
    // })
    // this.subscribers.clear()
  }
}
