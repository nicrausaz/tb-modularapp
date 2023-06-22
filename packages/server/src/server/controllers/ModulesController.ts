import { NextFunction, Request, Response } from 'express'
import { ModuleProps } from '@yalk/module'
import { ModuleService } from '../services'
import type { UploadedFile } from 'express-fileupload'
import { BadRequestError, NotFoundError } from '../middlewares/HTTPError'

/**
 * Controller for the modules routes
 */
export default class ModulesController {
  constructor(private moduleService: ModuleService) {}

  /**
   * GET
   * Get all the modules
   */
  index = async (req: Request, res: Response) => {
    res.send(await this.moduleService.getModules())
  }

  /**
   * GET
   * Get a module by its id
   */
  module = async (req: Request, res: Response, next: NextFunction) => {
    const moduleId = req.params.id
    const module = await this.moduleService.getModule(moduleId)

    if (!module) {
      return next(new NotFoundError('Module not found'))
    }

    res.send(module)
  }

  /**
   * GET
   * Register to a module's events & render trough SSE
   */
  moduleEvents = async (req: Request, res: Response, next: NextFunction) => {
    // Get the module
    const moduleId = req.params.id

    const handleModuleEvent = (render: string) => {
      res.write(`data: ${render}\n\n`)
    }

    this.moduleService.subscribeToModuleEvents(moduleId, handleModuleEvent)

    // Configure the SSE
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    // res.write('data: Connected\n\n')

    // Gestion de la fin de la connexion SSE
    // TODO: THIS IS NOT WORKING (only working server side)
    // req.on('close', () => {
    //   console.log('SSE Connection closed')
    //   this.moduleService.unsubscribeFromModuleEvents(moduleId, handleModuleEvent)
    // })

    // req.on('end', () => {
    //   console.log('SSE Connection closed')
    //   this.moduleService.unsubscribeFromModuleEvents(moduleId, handleModuleEvent)
    // })
  }

  /**
   * POST
   * Send an event to a module
   */
  sendEvent = async (req: Request, res: Response, next: NextFunction) => {
    const moduleId = req.params.id
    const entry = await this.moduleService.getModuleWithEvents(moduleId)

    if (!entry) {
      return next(new NotFoundError('The specified module does not exist or is not enabled'))
    }

    // Todo: method to send an event to a module
    // entry.module.emit('data', req.body)

    res.status(204).send()
  }

  /**
   * GET
   * Get a module's configuration
   */
  moduleConfiguration = async (req: Request, res: Response, next: NextFunction) => {
    const module = await this.moduleService.getModule(req.params.id)

    if (!module) {
      return next(new NotFoundError('Module not found'))
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
    const updatedId = this.moduleService.updateModuleConfiguration(req.params.id, req.body)

    if (!updatedId) {
      throw new NotFoundError('Module not found')
    }

    res.status(200).send({
      message: 'Module configuration updated successfully',
      moduleId: updatedId,
    })
  }

  /**
   * POST
   * Update a module's status (enabled or disabled)
   */
  moduleStatusUpdate = (req: Request, res: Response) => {
    const updatedId = this.moduleService.updateModuleEnabled(req.params.id, req.body.enabled)

    if (!updatedId) {
      throw new NotFoundError('Module not found')
    }

    const message = req.body.enabled ? 'Module enabled successfully' : 'Module disabled successfully'
    res.status(200).send({
      message,
      moduleId: updatedId,
    })
  }

  /**
   * POST
   * Upload a module (from zip) and register it
   */
  upload = (req: Request, res: Response, next: NextFunction) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      throw new BadRequestError('No files were uploaded')
    }

    const file = req.files.file as UploadedFile

    if (file.mimetype !== 'application/zip') {
      throw new BadRequestError('The file must be a zip')
    }

    this.moduleService
      .uploadModule(file)
      .then((id) => res.status(201).send({ message: 'Module uploaded and registered successfully', moduleId: id }))
      .catch(() => next(new BadRequestError('The module could not be uploaded. Please check its configuration')))
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
