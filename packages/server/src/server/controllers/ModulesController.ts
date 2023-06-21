import { NextFunction, Request, Response } from 'express'
import { renderToStaticMarkup } from 'react-dom/server'
import { ModuleProps } from '@yalk/module'
import { ModuleService } from '../services'
import type { UploadedFile } from 'express-fileupload'
import { BadRequestError, NotFoundError } from '../middlewares/HTTPError'

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
      throw new NotFoundError('Module not found')
    }

    res.send(module)
  }

  /**
   * GET
   * Register to a module's events & render trough SSE
   */
  moduleEvents = (req: Request, res: Response) => {
    // Get the module
    const moduleId = req.params.id
    const entry = this.moduleService.getModuleWithEvents(moduleId)

    if (!entry) {
      throw new NotFoundError('The specified module does not exist or is not enabled')
    }

    const module = entry.module

    const handleModuleEvent = (data: ModuleProps) => {
      const reponseData = {
        data,
        render: module.renderer !== undefined ? renderToStaticMarkup(module.renderer.render(data)) : null,
      }
      res.write(`data: ${JSON.stringify(reponseData)}\n\n`)
    }

    // Subscribe to the module's events
    this.moduleService.subscribeToModuleEvents(moduleId, handleModuleEvent)

    // Configure the SSE
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    // res.write('data: Connected\n\n')

    // Gestion de la fin de la connexion SSE
    req.on('close', () => {
      this.moduleService.unsubscribeFromModuleEvents(moduleId, handleModuleEvent)
    })
  }

  /**
   * POST
   * Send an event to a module
   */
  sendEvent = (req: Request, res: Response) => {
    const moduleId = req.params.id
    const entry = this.moduleService.getModuleWithEvents(moduleId)

    if (!entry) {
      throw new NotFoundError('The specified module does not exist or is not enabled')
    }

    entry.module.emit('data', req.body)

    res.status(204).send()
  }

  /**
   * GET
   * Get a module's configuration
   */
  moduleConfiguration = (req: Request, res: Response) => {
    const module = this.moduleService.getModule(req.params.id)

    if (!module) {
      throw new NotFoundError('Module not found')
    }

    res.send({
      default: module.defaultConfig,
      current: module.currentConfig,
    })
  }

  /**
   * PUT
   * Update a module's configuration
   */
  moduleConfigurationUpdate = (req: Request, res: Response) => {
    const entry = this.moduleService.updateModuleConfiguration(req.params.id, req.body)

    if (entry === null) {
      throw new NotFoundError('Module not found')
    }

    res.status(204).send()
  }

  /**
   * POST
   * Update a module's status (enabled or disabled)
   */
  moduleStatusUpdate = (req: Request, res: Response) => {
    const entry = this.moduleService.updateModuleEnabled(req.params.id, req.body.enabled)

    if (!entry) {
      throw new NotFoundError('Module not found')
    }

    res.status(204).send()
  }

  /**
   * POST
   * Upload a module (from zip) and register it
   */
  upload = (req: Request, res: Response, next: NextFunction) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      throw new BadRequestError('No files were uploaded.')
    }

    this.moduleService
      .uploadModule(req.files.file as UploadedFile)
      .then((id) => res.status(201).send({ message: 'Module uploaded and registered successfully', moduleId: id }))
      .catch(() => next(new BadRequestError('The module could not be uploaded. Please check its configuration.')))
  }

  /**
   * DELETE
   * Delete a module
   */
  delete = (req: Request, res: Response) => {
    this.moduleService.unregisterModule(req.params.id)
    res.status(204).send()
  }
}
