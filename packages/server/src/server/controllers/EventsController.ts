import WebSocket from 'ws'
import { ModulesService, ScreensService } from '../services'

type ModuleRecEvent = {
  id: string
  action: 'subscribe' | 'unsubscribe'
}

type ScreenRecEvent = {
  id: string
  action: 'subscribe' | 'unsubscribe'
}

/**
 * Controller handling events subscriptions and unsubscriptions
 */
export default class EventsController {
  private readonly modulesSubscribers: Map<string, Map<WebSocket, Set<(render: string) => void>>> = new Map()
  private readonly screensSubscribers: Map<number, Map<WebSocket, Set<() => void>>> = new Map()

  constructor(private modulesService: ModulesService, private screensService: ScreensService) {}

  handleModule(conn: WebSocket, data: ModuleRecEvent) {
    const moduleId = data.id

    if (data.action === 'subscribe') {
      this.subscribeToModule(conn, moduleId)
    } else if (data.action === 'unsubscribe') {
      console.log('Unsubscribe from module', moduleId)
      this.unsubscribeFromModule(conn, moduleId)
    }
  }

  handleScreen(conn: WebSocket, data: ScreenRecEvent) {
    const screenId = parseInt(data.id)

    if (data.action === 'subscribe') {
      this.subscribeToScreen(conn, screenId)
    } else if (data.action === 'unsubscribe') {
      this.unsubscribeFromScreen(conn, screenId)
    }
  }

  private subscribeToModule(conn: WebSocket, moduleId: string) {
    const callback = (render: string) => {
      conn.send(
        JSON.stringify({
          type: 'module',
          id: moduleId,
          render,
        }),
      )
    }

    let moduleSubscribers = this.modulesSubscribers.get(moduleId)
    if (!moduleSubscribers) {
      moduleSubscribers = new Map()
      this.modulesSubscribers.set(moduleId, moduleSubscribers)
    }

    let clientCallbacks = moduleSubscribers.get(conn)
    if (!clientCallbacks) {
      clientCallbacks = new Set()
      moduleSubscribers.set(conn, clientCallbacks)
    }
    clientCallbacks.add(callback)

    this.modulesService.subscribeToModuleEvents(moduleId, callback).catch(() => {
      conn.send(
        JSON.stringify({
          type: 'module',
          id: moduleId,
          error: 'Module is disabled',
        }),
      )
      clientCallbacks?.delete(callback)
    })
  }

  private unsubscribeFromModule(conn: WebSocket, moduleId: string) {
    const moduleSubscribers = this.modulesSubscribers.get(moduleId)
    if (!moduleSubscribers) {
      return
    }

    const clientCallbacks = moduleSubscribers.get(conn)
    if (!clientCallbacks) {
      return
    }

    clientCallbacks.forEach((callback) => {
      this.modulesService.unsubscribeFromModuleEvents(moduleId, callback)
    })
    clientCallbacks.clear()
    moduleSubscribers.delete(conn)
  }

  // unsubscribeAll() {
  //   for (const [moduleId, moduleSubscribers] of this.modulesSubscribers.entries()) {
  //     moduleSubscribers.forEach((clientCallbacks) => {
  //       clientCallbacks.forEach((callback) => {
  //         this.modulesService.unsubscribeFromModuleEvents(moduleId, callback)
  //       })
  //     })
  //   }
  //   this.modulesSubscribers.clear()
  // }

  private subscribeToScreen(conn: WebSocket, screenId: number) {
    const callback = () => {
      this.screensService
        .getScreen(screenId)
        .then((screen) => {
          conn.send(
            JSON.stringify({
              type: 'screen',
              id: screenId,
              data: screen,
            }),
          )
        })
        .catch((err) => {
          conn.send(
            JSON.stringify({
              type: 'screen',
              id: screenId,
              error: err.message,
            }),
          )
        })
    }

    let screenSubscribers = this.screensSubscribers.get(screenId)
    if (!screenSubscribers) {
      screenSubscribers = new Map()
      this.screensSubscribers.set(screenId, screenSubscribers)
    }

    let clientCallbacks = screenSubscribers.get(conn)
    if (!clientCallbacks) {
      clientCallbacks = new Set()
      screenSubscribers.set(conn, clientCallbacks)
    }
    clientCallbacks.add(callback)

    this.screensService.subscribeToScreen(screenId, callback)
    callback()
  }

  private unsubscribeFromScreen(conn: WebSocket, screenId: number) {
    const screenSubscribers = this.screensSubscribers.get(screenId)
    if (!screenSubscribers) {
      return
    }

    const clientCallbacks = screenSubscribers.get(conn)
    if (!clientCallbacks) {
      return
    }

    clientCallbacks.forEach((callback) => {
      this.screensService.unsubscribeFromScreen(screenId, callback)
    })

    clientCallbacks.clear()
    screenSubscribers.delete(conn)
  }
}
