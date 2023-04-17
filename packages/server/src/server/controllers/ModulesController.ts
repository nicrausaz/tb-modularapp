import { Request, Response } from 'express'
import { Manager } from '@yalk/module-manager'
import { renderToStaticMarkup } from 'react-dom/server'

export default class ModulesController {
  constructor(/* private homeRepository: ModulesRepository */ private manager: Manager) {}

  /**
   * GET
   * Get all the modules
   */
  index = (req: Request, res: Response) => {
    const mods = this.manager.getModules().map((m) => m)
    res.send(mods)
  }

  /**
   * GET
   * Register to a module's events & render trough SSE
   */
  module = async (req: Request, res: Response) => {
    // Get the module
    const module = this.manager.getModule(req.params.id)

    if (!module) {
      res.status(404).send('Module not found')
      return
    }

    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    res.write('data: Connected\n\n')

    const handleModuleEvent = (data: any) => {
      const reponseData = {
        data,
        render: module.renderer !== undefined ? renderToStaticMarkup(module.renderer.render(data)) : null,
      }
      res.write(`data: ${JSON.stringify(reponseData)}\n\n`)
    }

    module.on('update', handleModuleEvent)

    // Gestion de la fin de la connexion SSE
    req.on('close', () => {
      module.removeListener('update', handleModuleEvent)
    })
  }

  /**
   * GET
   * Get a module's configuration
   */
  moduleConfiguration = (req: Request, res: Response) => {
    const module = this.manager.getModule(req.params.id)

    if (!module) {
      res.status(404).send('Module not found')
    } else {
      res.send(module.toDTO())
    }
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
        },
      ],
    })
  }
}
