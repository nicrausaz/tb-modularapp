import { Request, Response } from 'express'
import { Manager } from '@yalk/module-manager'

export default class ModulesController {
  constructor(/* private homeRepository: ModulesRepository */ private manager: Manager) {}

  /**
   * GET
   * Get all the modules
   */
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
   * GET
   * Register to a module's events trough SSE
   */
  module = (req: Request, res: Response) => {
    // Get the module
    const module = this.manager.getModule(req.params.id)

    if (!module) {
      res.status(404).send('Module not found')
      return
    }



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


  /**
   * GET
   * Get a module's configuration
   */
  moduleConfiguration = (req: Request, res: Response) => {
    res.send({
      fields: [
        {
          name: 'test',
          type: 'text',
        }
      ]
    })
  }

  /**
   * POST
   * Update a module's configuration
   */
  moduleConfigurationUpdate = (req: Request, res: Response) => {
    res.send({
      fields: [
        {
          name: 'test',
          type: 'text',
        }
      ]
    })
  }
}
