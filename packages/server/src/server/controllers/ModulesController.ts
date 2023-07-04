import { NextFunction, Request, Response } from 'express'
import { ModulesService } from '../services'
import type { UploadedFile } from 'express-fileupload'
import { BadRequestError } from '../middlewares/HTTPError'

/**
 * Controller for the modules routes
 */
export default class ModulesController {
  constructor(private modulesService: ModulesService) {}

  /**
   * GET
   * Get all the modules
   */
  index = async (req: Request, res: Response) => {
    res.send(await this.modulesService.getModules())
  }

  /**
   * GET
   * Get a module by its id
   */
  module = (req: Request, res: Response, next: NextFunction) => {
    this.modulesService
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
    this.modulesService
      .updateModule(moduleId, req.body)
      .then(() => res.status(204).send())
      .catch(next)
  }

  /**
   * POST
   * Send an event to a module
   */
  sendEvent = async (req: Request, res: Response, next: NextFunction) => {
    this.modulesService
      .sendEventToModule(req.params.id, req.body)
      .then(() => res.status(204).send())
      .catch(next)
  }

  /**
   * GET
   * Get a module's configuration
   */
  moduleConfiguration = (req: Request, res: Response, next: NextFunction) => {
    this.modulesService
      .getModuleConfiguration(req.params.id)
      .then((config) => res.send(config))
      .catch(next)
  }

  /**
   * PUT
   * Update a module's configuration
   */
  moduleConfigurationUpdate = (req: Request, res: Response, next: NextFunction) => {
    this.modulesService
      .updateModuleConfiguration(req.params.id, req.body)
      .then(() => res.status(204).send())
      .catch(next)
  }

  /**
   * POST
   * Reset a module's configuration to its default
   */
  moduleConfigurationResetDefault = (req: Request, res: Response, next: NextFunction) => {
    this.modulesService
      .resetModuleConfigurationToDefault(req.params.id)
      .then(() => res.status(204).send())
      .catch(next)
  }

  /**
   * POST
   * Update a module's status (enabled or disabled)
   */
  moduleStatusUpdate = async (req: Request, res: Response, next: NextFunction) => {
    this.modulesService
      .updateModuleEnabled(req.params.id, req.body.enabled)
      .then(() => res.status(204).send())
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

    this.modulesService
      .uploadModule(file)
      .then((id) => res.status(201).send({ message: 'Module uploaded and registered successfully', moduleId: id }))
      .catch((e) => next(new BadRequestError(e)))
  }

  /**
   * DELETE
   * Delete a module
   */
  delete = (req: Request, res: Response, next: NextFunction) => {
    this.modulesService
      .unregisterModule(req.params.id)
      .then(() => res.status(204).send())
      .catch(next)
  }
}
