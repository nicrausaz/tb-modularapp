import express from 'express'
import { AuthController, BoxController, ModulesController, ScreensController, UsersController } from './controllers'
import { BoxService, ModulesService, ScreensService, UsersService } from './services'
import { UsersRepository, ModulesRepository, ScreensRepository, BoxRepository } from './repositories'
import { APIKeyAuthMiddleware, JwtAuthMiddleware } from './middlewares/AuthMiddleware'
import ModuleDatabaseManager from './helpers/ModuleDatabaseManager'
import {
  boxUpdateRules,
  generateAPIKeyRules,
  loginRules,
  moduleConfigurationUpdateRules,
  moduleStatusUpdateRules,
  moduleUpdateRules,
  screenUpdateRules,
  userCreateRules,
  userUpdateRules,
} from './models/validators'
import Validator from './middlewares/ValidationMiddleware'
import ScreenLiveUpdater from './helpers/ScreenLiveUpdater'
import WebSocket from 'ws'
import logger from './libs/logger'
import EventsController from './controllers/EventsController'
import ModuleLiveUpdater from './helpers/ModuleLiveUpdater'

// TODO: Add validation errors to the swagger documentation

/**
 * Define all the routes for the application
 *
 * @param app The express application
 */
const configureRoutes = (app: express.Application, manager: ModuleDatabaseManager, wss: WebSocket.Server) => {
  // Intialize specific dependencies
  const moduleUpdater = new ModuleLiveUpdater()
  const screenUpdater = new ScreenLiveUpdater()

  // Create the repositories
  const userRepository = new UsersRepository()
  const modulesRepository = new ModulesRepository(manager)
  const screensRepository = new ScreensRepository()
  const boxRepository = new BoxRepository()

  // Create the services
  const usersService = new UsersService(userRepository)
  const modulesService = new ModulesService(modulesRepository, screensRepository, moduleUpdater)
  const screensService = new ScreensService(screensRepository, screenUpdater)
  const boxService = new BoxService(boxRepository)

  // Create the controllers
  const authController = new AuthController(usersService)
  const modulesController = new ModulesController(modulesService)
  const screensController = new ScreensController(screensService)
  const boxController = new BoxController(boxService)
  const usersController = new UsersController(usersService)
  const eventsController = new EventsController(modulesService, screensService)

  /**
   * Auth routes
   */
  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: Authenticate a user
   *     tags: [Auth]
   *     description: Authenticate a user with a username and a password and return a JWT token
   *     requestBody:
   *        required: true
   *        content:
   *          application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  username:
   *                    type: string
   *                  password:
   *                    type: string
   *     responses:
   *       200:
   *         description: Authentication success
   *         content:
   *           application/json:
   *             schema:
   *               type: string
   *             example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
   *       401:
   *        description: Authentication failed
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message:
   *                  type: string
   */
  app.post('/api/auth/login', Validator(loginRules), authController.login)

  /**
   * @swagger
   * /api/auth/me:
   *   get:
   *     summary: Get the connected user information
   *     tags: [Auth]
   *     description: Decode the JWT token and return the user information
   *     security:
   *       - bearer: []
   *     responses:
   *       200:
   *         description: Valid token, return the user information
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: number
   *                 username:
   *                   type: string
   *                 iat:
   *                   type: number
   *                 exp:
   *                   type: number
   *             example: {
   *                           "id": 1,
   *                           "username": "admin",
   *                           "iat": 1687410812,
   *                           "exp": 1687497212
   *                       }
   *       401:
   *        description: Invalid or expired token
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message:
   *                  type: string
   *            example: {"message": "Token invalid or expired"}
   */
  app.get('/api/auth/me', JwtAuthMiddleware, authController.me)

  /**
   * Modules routes
   */
  /**
   * @swagger
   * /api/modules:
   *   get:
   *     summary: Get the imported modules
   *     description: Get the list of modules imported in the application
   *     tags: [Modules]
   *     security:
   *       - bearer: []
   *     responses:
   *       200:
   *         description: List of modules
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 modules:
   *                   type: array
   *             example: [{
   *                           "id": "1344ca73-5bd2-472e-a75d-45d2c6c5f7a0",
   *                           "name": "ZIP-Module",
   *                           "description": "A module used for debug",
   *                           "author": "Test",
   *                           "version": "1.0.0",
   *                           "icon": "debug.png",
   *                           "nickname": null,
   *                           "enabled": false,
   *                           "importedAt": "2023-06-22 08:08:47"
   *                       }]
   */
  app.get('/api/modules', JwtAuthMiddleware, modulesController.index)

  /**
   * @swagger
   * /api/modules:
   *   post:
   *     summary: Import a module
   *     description: Import the archive file of a module into the application
   *     tags: [Modules]
   *     security:
   *       - bearer: []
   *     consumes:
   *       - multipart/form-data
   *     parameters:
   *        - in: formData
   *          name: file
   *          type: file
   *          description: The module archive file
   *     responses:
   *       200:
   *         description: Module imported successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 moduleId:
   *                   type: string
   *             example: {
   *                          "message": "Module uploaded and registered successfully",
   *                          "moduleId": "1344ca73-5bd2-472e-a75d-45d2c6c5f7a0"
   *                       }
   *       400:
   *         description: No file provided, invalid file format or invalid archive structure. Each error is returned in the response message
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *             example: {
   *                          "message": "No files were uploaded",
   *                       }
   */
  app.post('/api/modules', JwtAuthMiddleware, modulesController.upload)

  /**
   * @swagger
   * /api/modules/{id}:
   *   get:
   *     summary: Get a module
   *     description: Get a module information and its configuration
   *     tags: [Modules]
   *     security:
   *       - bearer: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The module id
   *     responses:
   *       200:
   *         description: Module exists
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 moduleId:
   *                   type: string
   *             example: {
   *                         "id": "1344ca73-5bd2-472e-a75d-45d2c6c5f7a0",
   *                         "name": "ZIP-Module",
   *                         "description": "A module used for debug",
   *                         "author": "Nicolas Crausaz",
   *                         "version": "1.0.0",
   *                         "icon": "debug.png",
   *                         "nickname": null,
   *                         "enabled": false,
   *                         "importedAt": "2023-06-22 08:08:47",
   *                         "currentConfig": []
   *                      }
   *       404:
   *         description: The module does not exist
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *             example: {
   *                          "message": "Module not found",
   *                       }
   */
  app.get('/api/modules/:id', JwtAuthMiddleware, modulesController.module)

  /**
   * @swagger
   * /api/modules/{id}:
   *   delete:
   *     summary: Delete a module
   *     description: Delete a module from the application
   *     tags: [Modules]
   *     security:
   *       - bearer: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The module id
   *     responses:
   *       204:
   *         description: Module deleted
   *       404:
   *         description: The module does not exist
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *             example: {
   *                          "message": "Module not found",
   *                       }
   */
  app.delete('/api/modules/:id', JwtAuthMiddleware, modulesController.delete)

  /**
   * @swagger
   * /api/modules/{id}:
   *   patch:
   *     summary: Update a module
   *     description: Update a module information
   *     tags: [Modules]
   *     security:
   *       - bearer: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The module id
   *     requestBody:
   *        required: true
   *        content:
   *          application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  nickname:
   *                    type: string
   *     responses:
   *       204:
   *         description: Module updated
   *       404:
   *         description: The module does not exist
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *             example: {
   *                          "message": "Module not found",
   *                       }
   */
  app.patch('/api/modules/:id', Validator(moduleUpdateRules), JwtAuthMiddleware, modulesController.update)

  /**
   * @swagger
   * /api/modules/{id}/events:
   *   post:
   *     summary: Send an event to a module
   *     description: Send an event to a module
   *     tags: [Modules]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The module id
   *     requestBody:
   *        required: true
   *        content:
   *          application/json:
   *              schema:
   *                type: object
   *     responses:
   *       204:
   *         description: Event sent
   *       403:
   *         description: The module is not enabled or not allowed to receive events
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *             example: {
   *                          "message": "Module with id 5f68ba88-df21-4fbe-98b8-f39a6b6e469a is not allowed to receive HTTP data",
   *                       }
   *       404:
   *         description: The module does not exist
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *             example: {
   *                          "message": "Module not found",
   *                       }
   */
  app.post('/api/modules/:id/events', APIKeyAuthMiddleware, modulesController.sendEvent)

  /**
   * @swagger
   * /api/modules/{id}/configuration:
   *   get:
   *     summary: Get the configuration of a module
   *     description: Get the configuration of a module
   *     tags: [Modules]
   *     security:
   *       - bearer: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The module id
   *     responses:
   *       200:
   *         description: Module exists
   *         content:
   *           application/json:
   *           schema:
   *             type: array
   *           example:
   *                 [
   *                   {
   *                     'name': 'refreshRate',
   *                     'type': 'number',
   *                     'label': 'Refresh rate',
   *                     'description': 'The refresh rate in ms',
   *                     'value': 1000,
   *                   },
   *                 ]
   *       404:
   *         description: The module does not exist
   *         content:
   *           application/json:
   *           schema:
   *             type: object
   *             properties:
   *               message:
   *                 type: string
   *           example: { 'message': 'Module not found' }
   */
  app.get('/api/modules/:id/configuration', JwtAuthMiddleware, modulesController.moduleConfiguration)

  /**
   * @swagger
   * /api/modules/{id}/configuration:
   *   put:
   *     summary: Update the configuration of a module
   *     description: Update the configuration of a module
   *     tags: [Modules]
   *     security:
   *     - bearer: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The module id
   *     requestBody:
   *        required: true
   *        content:
   *          application/json:
   *             schema:
   *               type: array
   *             example:
   *                 [
   *                   {
   *                     'name': 'refreshRate',
   *                     'type': 'number',
   *                     'label': 'Refresh rate',
   *                     'description': 'The refresh rate in ms',
   *                     'value': 1000,
   *                   },
   *                 ]
   *     responses:
   *       204:
   *         description: Module configuration updated
   *       404:
   *         description: The module does not exist
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *             example: {
   *                          "message": "Module not found",
   *                       }
   */
  app.put(
    '/api/modules/:id/configuration',
    Validator(moduleConfigurationUpdateRules),
    JwtAuthMiddleware,
    modulesController.moduleConfigurationUpdate,
  )

  /**
   * @swagger
   * /api/modules/{id}/configuration/default:
   *   post:
   *     summary: Reset the configuration of a module to default
   *     description: Reset the configuration of a module to default
   *     tags: [Modules]
   *     security:
   *     - bearer: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The module id
   *     responses:
   *       204:
   *         description: Module configuration updated
   *       404:
   *         description: The module does not exist
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *             example: {
   *                          "message": "Module not found",
   *                       }
   */
  app.post(
    '/api/modules/:id/configuration/default',
    JwtAuthMiddleware,
    modulesController.moduleConfigurationResetDefault,
  )

  /**
   * @swagger
   * /api/modules/{id}/status:
   *   post:
   *     summary: Update the status of a module
   *     description: Enable or disable a module
   *     tags: [Modules]
   *     security:
   *       - bearer: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The module id
   *     requestBody:
   *        required: true
   *        content:
   *          application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 enabled:
   *                   type: boolean
   *             example: {
   *                     'enabled': true,
   *                   }
   *     responses:
   *       204:
   *         description: Module status updated
   *       400:
   *         description: Invalid status value. The status must be a boolean
   */
  app.post(
    '/api/modules/:id/status',
    Validator(moduleStatusUpdateRules),
    JwtAuthMiddleware,
    modulesController.moduleStatusUpdate,
  )

  /**
   * Screens routes
   */

  /**
   * @swagger
   * /api/screens:
   *   get:
   *     summary: Get all screens
   *     description: Get all screens
   *     tags: [Screens]
   *     security:
   *       - bearer: []
   *     responses:
   *       200:
   *         description: Return all screens
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *             example:
   *                   [
   *                     {
   *                       'id': 1,
   *                       'name': 'screen 1',
   *                       'enabled': true,
   *                       'slots': []
   *                     },
   *                   ]
   */
  app.get('/api/screens', JwtAuthMiddleware, screensController.index)

  /**
   * @swagger
   * /api/screens/{id}:
   *   get:
   *     summary: Get a screen
   *     description: Get a screen
   *     tags: [Screens]
   *     security:
   *       - bearer: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The screen id
   *     responses:
   *       200:
   *         description: Screen exists
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *             example:
   *                     {
   *                       'id': 1,
   *                       'name': 'screen 1',
   *                       'enabled': true,
   *                       'slots': []
   *                     }
   *       404:
   *         description: The screen does not exist
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *             example: {
   *                          "message": "Screen not found",
   *                       }
   */
  app.get('/api/screens/:id', screensController.screen)

  /**
   * @swagger
   * /api/screens:
   *   put:
   *     summary: Create or update a screen
   *     description: Create or update a screen
   *     tags: [Screens]
   *     security:
   *       - bearer: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The screen id
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               id:
   *                 type: integer
   *               name:
   *                 type: string
   *               enabled:
   *                 type: boolean
   *               slots:
   *                 type: array
   *     responses:
   *       204:
   *         description: Screen updated
   *       404:
   *         description: The screen does not exist
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *             example: {
   *                          "message": "Screen not found",
   *                       }
   */
  app.put('/api/screens/:id', Validator(screenUpdateRules), JwtAuthMiddleware, screensController.createOrUpdate)

  /**
   * @swagger
   * /api/screens/{id}:
   *   delete:
   *     summary: Delete a screen
   *     description: Delete a screen
   *     tags: [Screens]
   *     security:
   *       - bearer: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The screen id
   *     responses:
   *       204:
   *         description: Screen deleted
   *       404:
   *         description: The screen does not exist
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *             example: {
   *                          "message": "Screen not found",
   *                       }
   */
  app.delete('/api/screens/:id', JwtAuthMiddleware, screensController.delete)

  /**
   * Box routes
   */
  app.get('/api/box', boxController.index)

  app.put('/api/box', Validator(boxUpdateRules), JwtAuthMiddleware, boxController.update)

  app.put('/api/box/icon', JwtAuthMiddleware, boxController.updateIcon)

  app.get('/api/box/static/:filename', boxController.staticFile)

  app.get('/api/box/static/module/:moduleId/:filename', boxController.moduleStaticFile)

  app.get('/api/box/static/user/:filename', boxController.userStaticFile)

  app.get('/api/box/security/keys', JwtAuthMiddleware, boxController.APIKeys)

  app.post('/api/box/security/keys', Validator(generateAPIKeyRules), JwtAuthMiddleware, boxController.generateAPIKey)

  app.delete('/api/box/security/keys/:id', JwtAuthMiddleware, boxController.deleteAPIKey)

  /**
   * User routes
   */
  app.get('/api/users', JwtAuthMiddleware, usersController.index)

  app.post('/api/users', Validator(userCreateRules), JwtAuthMiddleware, usersController.create)

  app.patch('/api/users/:id', Validator(userUpdateRules), JwtAuthMiddleware, usersController.update)

  app.put('/api/users/:id/avatar', JwtAuthMiddleware, usersController.updatePicture)

  app.delete('/api/users/:id', JwtAuthMiddleware, usersController.delete)

  // Bind the WebSocket handler (act as a router)
  wss.on('connection', (ws) => {
    logger.info('[WS] Client connected')

    ws.on('message', (message) => {
      const data = JSON.parse(message.toString())

      if (data.type === 'module') {
        eventsController.handleModule(ws, data)
      } else if (data.type === 'screen') {
        eventsController.handleScreen(ws, data)
      }
    })

    ws.on('close', () => {
      logger.info('[WS] Client disconnected')
    })
  })
}

export default configureRoutes
