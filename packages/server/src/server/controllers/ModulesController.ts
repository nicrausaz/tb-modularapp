import { Request, Response } from 'express'
import { renderToStaticMarkup } from 'react-dom/server'
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
   * Get a module by its id
   */
  module = (req: Request, res: Response) => {
    const moduleId = req.params.id
    const module = this.moduleService.getModule(moduleId)

    if (!module) {
      res.status(404).send('Module not found')
      return
    }

    res.send(module)
  }

  /**
   * GET
   * Register to a module's events & render trough SSE
   */
  moduleEvents = async (req: Request, res: Response) => {
    // Get the module
    const moduleId = req.params.id
    const entry = this.moduleService.getModuleWithEvents(moduleId)

    // TODO: check if the module is enabled

    if (!entry) {
      res.status(404).send('Module not found')
      return
    }

    if (!entry.enabled) {
      res.status(400).send('Module not enabled')
      return
    }

    const module = entry.module

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
        default: module.defaultConfig,
        current: module.currentConfig,
      })
    }
  }

  /**
   * PUT
   * Update a module's configuration
   */
  moduleConfigurationUpdate = (req: Request, res: Response) => {
    this.moduleService.updateModuleConfiguration(req.params.id, req.body)

    res.send(req.body)
  }
}
