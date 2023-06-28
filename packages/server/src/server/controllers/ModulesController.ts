import { NextFunction, Request, Response } from 'express'
import { ModuleService } from '../services'
import type { UploadedFile } from 'express-fileupload'
import { BadRequestError } from '../middlewares/HTTPError'

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
  module = (req: Request, res: Response, next: NextFunction) => {
    this.moduleService
      .getModule(req.params.id)
      .then((module) => res.send(module))
      .catch(next)
  }

  /**
   * PATCH
   * Update a module information
   */
  update = (req: Request, res: Response, next: NextFunction) => {
    const moduleId = req.params.id
    this.moduleService
      .updateModule(moduleId, req.body)
      .then(() => res.status(204).send())
      .catch(next)
  }

  /**
   * GET
   * Register to a module's events & render trough SSE
   */
  moduleEvents = async (req: Request, res: Response, next: NextFunction) => {
    const moduleId = req.params.id

    // Configure the SSE response headers
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    const handleModuleEvent = (render: string) => {
      res.write(`data: ${render}\n\n`)
    }

    this.moduleService.subscribeToModuleEvents(moduleId, handleModuleEvent).catch(next)

    // TODO: Might be good to sent to prevent timeout
    // res.write('data: Connected\n\n')

    // TODO: Find a way to unregister from module events when the client disconnects.
    // With SSE, it seems that it is not possible to detect when the client disconnects.

    // Handle termination of the connection (server side)
    req.on('close', () => {
      this.moduleService.unsubscribeFromModuleEvents(moduleId, handleModuleEvent).catch(next)
    })
  }

  /**
   * POST
   * Send an event to a module
   */
  sendEvent = async (req: Request, res: Response, next: NextFunction) => {
    this.moduleService
      .sendEventToModule(req.params.id, req.body)
      .then(() => res.status(204).send())
      .catch(next)
  }
  /**
   * GET
   * Get a module's configuration
   */
  moduleConfiguration = (req: Request, res: Response, next: NextFunction) => {
    this.moduleService
      .getModuleConfiguration(req.params.id)
      .then((config) => res.send(config))
      .catch(next)
  }

  /**
   * PUT
   * Update a module's configuration
   */
  moduleConfigurationUpdate = (req: Request, res: Response, next: NextFunction) => {
    this.moduleService
      .updateModuleConfiguration(req.params.id, req.body)
      .then(() => res.status(204).send())
      .catch(next)
  }

  /**
   * POST
   * Reset a module's configuration to its default
   */
  moduleConfigurationResetDefault = (req: Request, res: Response, next: NextFunction) => {
    this.moduleService
      .resetModuleConfigurationToDefault(req.params.id)
      .then(() => res.status(204).send())
      .catch(next)
  }

  /**
   * POST
   * Update a module's status (enabled or disabled)
   */
  moduleStatusUpdate = async (req: Request, res: Response, next: NextFunction) => {
    this.moduleService
      .updateModuleEnabled(req.params.id, req.body.enabled)
      .then(() =>
        res.send({
          message: req.body.enabled ? 'Module enabled successfully' : 'Module disabled successfully',
        }),
      )
      .catch((e) => next(e))
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
      .catch((e) => next(new BadRequestError(e)))
  }

  /**
   * DELETE
   * Delete a module
   */
  delete = (req: Request, res: Response, next: NextFunction) => {
    this.moduleService
      .unregisterModule(req.params.id)
      .then(() => res.status(204).send())
      .catch(next)
  }
}
