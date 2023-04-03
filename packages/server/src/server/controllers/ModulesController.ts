import { Request, Response } from 'express'
import { Manager } from '@yalk/module-manager'

export default class ModulesController {
  constructor(/* private homeRepository: ModulesRepository */ private manager: Manager) {}

  index = (req: Request, res: Response) => {
    const mods = this.manager.getModules().map((m) => {
      return {
        name: m.name,
        version: m.version,
        description: m.description,
      }
    })
    res.send(mods)
  }

  /**
   * Register to the module's events trough SSE
   */
  module = (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    res.write(`data: Current time is ${new Date().toLocaleTimeString()}\n\n`)

    // Envoi périodique de données SSE
    const intervalId = setInterval(() => {
      res.write(`data: Current time is ${new Date().toLocaleTimeString()}\n\n`)
    }, 5000)

    // Gestion de la fin de la connexion SSE
    req.on('close', () => {
      clearInterval(intervalId)
    })
  }
}
