import { Request, Response } from 'express'
import { renderToStaticMarkup } from 'react-dom/server'
import ModuleMapper from '../mappers/ModuleMapper'
import { ModuleProps } from '@yalk/module'
import { ModuleService } from '../services'

export default class ModulesController {
  constructor(private moduleService: ModuleService) {}

  /**
   * GET
   * Get all the modules
   */
  index = (req: Request, res: Response) => {
    res.send(this.moduleService.getModules())
  }

  /**
   * GET
   * Register to a module's events & render trough SSE
   */
  module = async (req: Request, res: Response) => {
    // Get the module
    const moduleId = req.params.id
    const module = this.moduleService.getModule(moduleId)

    if (!module) {
      res.status(404).send('Module not found')
      return
    }

    const handleModuleEvent = (data: ModuleProps) => {
      const reponseData = {
        data,
        render: module.renderer !== undefined ? renderToStaticMarkup(module.renderer.render(data)) : null,
      }
      res.write(`data: ${JSON.stringify(reponseData)}\n\n`)
    }

    // Register to the module's events
    // todo: this.manager.subscribeTo(moduleId, handleModuleEvent)
    module.on('update', handleModuleEvent)

    // Configure the SSE
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    res.write('data: Connected\n\n')

    // Gestion de la fin de la connexion SSE
    req.on('close', () => {
      // TODO: this.manager.unsubscribeFrom(moduleId, handleModuleEvent)
      module.removeListener('update', handleModuleEvent)
    })
  }

  /**
   * GET
   * Get a module's configuration
   */
  moduleConfiguration = (req: Request, res: Response) => {
    const module = this.moduleService.getModule(req.params.id)

    if (!module) {
      res.status(404).send('Module not found')
    } else {
      res.send({
        default: ModuleMapper.toModuleConfigurationDTO(module.defaultConfig),
        current: ModuleMapper.toModuleConfigurationDTO(module.currentConfig),
      })
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
