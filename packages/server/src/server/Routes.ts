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
  sendEventRules,
  sendMultipleEventsRules,
  userCreateRules,
  userUpdateRules,
} from './models/validators'
import Validator from './middlewares/ValidationMiddleware'
import ScreenLiveUpdater from './helpers/ScreenLiveUpdater'
import WebSocket from 'ws'
import logger from './libs/logger'
import EventsController from './controllers/EventsController'
import ModuleLiveUpdater from './helpers/ModuleLiveUpdater'

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
   *                    required: true
   *                  password:
   *                    type: string
   *                    required: true
   *     responses:
   *       200:
   *         description: Authentication success
   *         content:
   *           application/json:
   *             schema:
   *               type: string
   *             example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
   *       400:
   *        description: Username or password missing
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                errors:
   *                  type: array
   *                  items:
   *                    type: object
   *                    properties:
   *                      type:
   *                        type: string
   *                      value:
   *                        type: string
   *                      msg:
   *                        type: string
   *                      path:
   *                        type: string
   *                      location:
   *                        type: string
   *            example: {
   *               "errors": [
   *                   {
   *                       "type": "field",
   *                       "value": "",
   *                       "msg": "Password is required",
   *                       "path": "password",
   *                       "location": "body"
   *                   }
   *               ]
   *             }
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
  app.patch('/api/modules/:id', JwtAuthMiddleware, Validator(moduleUpdateRules), modulesController.update)

  /**
   * @swagger
   * /api/modules/{id}/events:
   *   post:
   *     summary: Send an event to a module
   *     description: Send an event to a module
   *     tags: [Modules]
   *     security:
   *       - apikey: []
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
   *                  data:
   *                    type: object
   *     responses:
   *       204:
   *         description: Event sent
   *       400:
   *        description: Invalid body structure (missing data)
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                errors:
   *                  type: array
   *                  items:
   *                    type: object
   *                    properties:
   *                      type:
   *                        type: string
   *                      value:
   *                        type: string
   *                      msg:
   *                        type: string
   *                      path:
   *                        type: string
   *                      location:
   *                        type: string
   *            example: {
   *               "errors": [
   *                   {
   *                       "type": "field",
   *                       "value": "",
   *                       "msg": "Data must be an object",
   *                       "path": "data",
   *                       "location": "body"
   *                   }
   *               ]
   *             }
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
  app.post('/api/modules/:id/events', APIKeyAuthMiddleware, Validator(sendEventRules), modulesController.sendEvent)

  /**
   * @swagger
   * /api/modules/events:
   *   post:
   *     summary: Send an event to multiple modules
   *     description: Send an event to multiple modules
   *     tags: [Modules]
   *     security:
   *       - apikey: []
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
   *                  ids:
   *                    type: array
   *                  data:
   *                    type: object
   *              example: {
   *                   "ids": [
   *                       "6881d200-9f96-4c9a-a290-226c42a9476f",
   *                       "cfc7c162-9700-493a-b8c8-5cf32e22d0ca"
   *                   ],
   *                   "data": {}
   *               }
   *     responses:
   *       204:
   *         description: Event sent
   *       400:
   *        description: Invalid body structure (missing ids or data)
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                errors:
   *                  type: array
   *                  items:
   *                    type: object
   *                    properties:
   *                      type:
   *                        type: string
   *                      value:
   *                        type: string
   *                      msg:
   *                        type: string
   *                      path:
   *                        type: string
   *                      location:
   *                        type: string
   *            example: {
   *               "errors": [
   *                   {
   *                       "type": "field",
   *                       "value": "",
   *                       "msg": "Data must be an object",
   *                       "path": "data",
   *                       "location": "body"
   *                   }
   *               ]
   *             }
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
  app.post(
    '/api/modules/events',
    APIKeyAuthMiddleware,
    Validator(sendMultipleEventsRules),
    modulesController.sendManyEvents,
  )

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
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *             example:
   *                   [
   *                     {
   *                       'name': 'refreshRate',
   *                       'type': 'number',
   *                       'label': 'Refresh rate',
   *                       'description': 'The refresh rate in ms',
   *                       'value': 1000,
   *                     },
   *                   ]
   *       404:
   *         description: The module does not exist
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *             example: { 'message': 'Module not found' }
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
   *       400:
   *        description: Invalid configuration values
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                errors:
   *                  type: array
   *                  items:
   *                    type: object
   *                    properties:
   *                      type:
   *                        type: string
   *                      value:
   *                        type: string
   *                      msg:
   *                        type: string
   *                      path:
   *                        type: string
   *                      location:
   *                        type: string
   *            example: {
   *               "errors": [
   *                   {
   *                       "type": "field",
   *                       "value": "",
   *                       "msg": "Name is required",
   *                       "path": "fields[0].name",
   *                       "location": "body"
   *                   }
   *               ]
   *             }
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
    JwtAuthMiddleware,
    Validator(moduleConfigurationUpdateRules),
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
    JwtAuthMiddleware,
    Validator(moduleStatusUpdateRules),
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
   *                 required: true
   *               name:
   *                 type: string
   *                 required: true
   *               enabled:
   *                 type: boolean
   *                 required: true
   *               slots:
   *                 type: array
   *                 required: true
   *     responses:
   *       204:
   *         description: Screen updated
   *       400:
   *        description: Invalid screen body
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                errors:
   *                  type: array
   *                  items:
   *                    type: object
   *                    properties:
   *                      type:
   *                        type: string
   *                      value:
   *                        type: string
   *                      msg:
   *                        type: string
   *                      path:
   *                        type: string
   *                      location:
   *                        type: string
   *            example: {
   *               "errors": [
   *                   {
   *                       "type": "field",
   *                       "value": "",
   *                       "msg": "Name is required",
   *                       "path": "name",
   *                       "location": "body"
   *                   }
   *               ]
   *             }
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
  app.put('/api/screens/:id', JwtAuthMiddleware, Validator(screenUpdateRules), screensController.createOrUpdate)

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

  /**
   * @swagger
   * /api/box:
   *   get:
   *     summary: Get box information
   *     description: Get box information
   *     tags: [Box]
   *     security:
   *       - bearer: []
   *     responses:
   *       200:
   *         description: Return box information
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 name:
   *                   type: string
   *                 logo:
   *                   type: string
   *                 version:
   *                   type: string
   *             example: {
   *                   "name": "Modular APP",
   *                   "icon": "logo.svg",
   *                   "version": "1.0.0"
   *                }
   */
  app.get('/api/box', boxController.index)

  /**
   * @swagger
   * /api/box:
   *   put:
   *     summary: Update box information
   *     description: Update box information
   *     tags: [Box]
   *     security:
   *       - bearer: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *              name:
   *                type: string
   *           example: {
   *             "name": "Modular APP"
   *            }
   *     responses:
   *       204:
   *         description: Box information updated
   *       400:
   *        description: Invalid box body
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                errors:
   *                  type: array
   *                  items:
   *                    type: object
   *                    properties:
   *                      type:
   *                        type: string
   *                      value:
   *                        type: string
   *                      msg:
   *                        type: string
   *                      path:
   *                        type: string
   *                      location:
   *                        type: string
   *            example: {
   *               "errors": [
   *                   {
   *                       "type": "field",
   *                       "value": "",
   *                       "msg": "Name is required",
   *                       "path": "name",
   *                       "location": "body"
   *                   }
   *               ]
   *             }
   */
  app.put('/api/box', JwtAuthMiddleware, Validator(boxUpdateRules), boxController.update)

  /**
   * @swagger
   * /api/box/icon:
   *   post:
   *     summary: Update the box icon
   *     description: Upload and update the box icon
   *     tags: [Box]
   *     security:
   *       - bearer: []
   *     consumes:
   *       - multipart/form-data
   *     parameters:
   *        - in: formData
   *          name: file
   *          type: file
   *          description: The icon to upload
   *     responses:
   *       200:
   *         description: Icon imported successfully
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
   *                          "message": "Icon updated successfully",
   *                          "moduleId": "icon.svg"
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
  app.put('/api/box/icon', JwtAuthMiddleware, boxController.updateIcon)

  /**
   * @swagger
   * /api/box/static/{filename}:
   *   get:
   *     summary: Get a static file (public)
   *     description: Get a static file from the public directory
   *     tags: [Box]
   *     parameters:
   *       - in: path
   *         name: filename
   *         schema:
   *           type: string
   *         required: true
   *         description: The name of the file to get
   *     responses:
   *       200:
   *         description: Return the file
   *       404:
   *         description: The file does not exist
   */
  app.get('/api/box/static/:filename', boxController.staticFile)

  /**
   * @swagger
   * /api/box/static/module/{moduleId}/{filename}:
   *   get:
   *     summary: Get a static file (module)
   *     description: Get a static file from a module directory
   *     tags: [Box]
   *     parameters:
   *       - in: path
   *         name: moduleId
   *         schema:
   *           type: string
   *         required: true
   *         description: The module id
   *       - in: path
   *         name: filename
   *         schema:
   *           type: string
   *         required: true
   *         description: The name of the file to get
   *     responses:
   *       200:
   *         description: Return the file
   *       404:
   *         description: The file does not exist
   */
  app.get('/api/box/static/module/:moduleId/:filename', boxController.moduleStaticFile)

  /**
   * @swagger
   * /api/box/static/user/{filename}:
   *   get:
   *     summary: Get a static file (user avatar)
   *     description: Get a static file from the user avatar directory
   *     tags: [Box]
   *     parameters:
   *       - in: path
   *         name: filename
   *         schema:
   *           type: string
   *         required: true
   *         description: The name of the file to get
   *     responses:
   *       200:
   *         description: Return the file
   *       404:
   *         description: The file does not exist
   */
  app.get('/api/box/static/user/:filename', boxController.userStaticFile)

  /**
   * @swagger
   * /api/box/security/keys:
   *   get:
   *     summary: Get API keys
   *     description: Get existing API keys, onyl the prefix of the keys are returned
   *     tags: [Box]
   *     security:
   *       - bearer: []
   *     responses:
   *       200:
   *         description: Return the API keys
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: string
   *                   display:
   *                     type: string
   *                   name:
   *                     type: string
   *                   createdAt:
   *                     type: string
   *             example: [
   *                 {
   *                     "id": 1,
   *                     "name": "sdfg",
   *                     "display": "bcef9∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗",
   *                     "createdAt": "2023-07-18 11:51:01"
   *                 },
   *                 {
   *                     "id": 2,
   *                     "name": "asdf",
   *                     "display": "6dd90∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗",
   *                     "createdAt": "2023-07-18 12:27:56"
   *                 }
   *               ]
   *
   *
   */
  app.get('/api/box/security/keys', JwtAuthMiddleware, boxController.APIKeys)

  /**
   * @swagger
   * /api/box/security/keys:
   *   post:
   *     summary: Generate a new API key
   *     description: Generate a new API key and return it
   *     tags: [Box]
   *     security:
   *       - bearer: []
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *     responses:
   *       200:
   *         description: Return the API key
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 key:
   *                   type: string
   *       400:
   *        description: Invalid api key name
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                errors:
   *                  type: array
   *                  items:
   *                    type: object
   *                    properties:
   *                      type:
   *                        type: string
   *                      value:
   *                        type: string
   *                      msg:
   *                        type: string
   *                      path:
   *                        type: string
   *                      location:
   *                        type: string
   *            example: {
   *               "errors": [
   *                   {
   *                       "type": "field",
   *                       "value": "",
   *                       "msg": "Name is required",
   *                       "path": "name",
   *                       "location": "body"
   *                   }
   *               ]
   *             }
   */
  app.post('/api/box/security/keys', JwtAuthMiddleware, Validator(generateAPIKeyRules), boxController.generateAPIKey)

  /**
   * @swagger
   * /api/box/security/keys/{id}:
   *   delete:
   *     summary: Delete an API key
   *     description: Delete an API key
   *     tags: [Box]
   *     security:
   *       - bearer: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *     responses:
   *       204:
   *         description: The API key has been deleted
   *       404:
   *         description: The API key does not exist
   */
  app.delete('/api/box/security/keys/:id', JwtAuthMiddleware, boxController.deleteAPIKey)

  /**
   * User routes
   */

  /**
   * @swagger
   * /api/users:
   *   get:
   *     summary: Get all users
   *     description: Get all users
   *     tags: [Users]
   *     security:
   *       - bearer: []
   *     responses:
   *       200:
   *         description: Return the users
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                  type: object
   *                  properties:
   *                    id:
   *                      type: integer
   *                    username:
   *                      type: string
   *                    avatar:
   *                      type: string
   *                    isDefault:
   *                      type: boolean
   */
  app.get('/api/users', JwtAuthMiddleware, usersController.index)

  /**
   * @swagger
   * /api/users/{id}:
   *   post:
   *     summary: Create a new user
   *     description: Create a new user
   *     tags: [Users]
   *     security:
   *       - bearer: []
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               username:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       204:
   *         description: The user has been created
   *       400:
   *        description: |
   *           Some fields are missing or invalid:
   *           + Missing username
   *           + The username is already taken 
   *           + The password does not match the requirements (8 chars min, 1 uppercase, 1 lowercase, 1 number, 1 special char)
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                errors:
   *                  type: array
   *                  items:
   *                    type: object
   *                    properties:
   *                      type:
   *                        type: string
   *                      value:
   *                        type: string
   *                      msg:
   *                        type: string
   *                      path:
   *                        type: string
   *                      location:
   *                        type: string
   *            example: {
   *               "errors": [
   *                   {
   *                       "type": "field",
   *                       "value": "",
   *                       "msg": "Username is required",
   *                       "path": "username",
   *                       "location": "body"
   *                   }
   *               ]
   *             }
   */
  app.post('/api/users', JwtAuthMiddleware, Validator(userCreateRules), usersController.create)

  /**
   * @swagger
   * /api/users/{id}:
   *   patch:
   *     summary: Update a user
   *     description: Update a user
   *     tags: [Users]
   *     security:
   *       - bearer: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *           required: true
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               username:
   *                 type: string
   *                 required: true
   *               password:
   *                 type: string
   *                 required: false
   *     responses:
   *       204:
   *         description: The user has been updated
   *       400:
   *        description: |
   *           Some fields are missing or invalid:
   *           + Missing username
   *           + The username is already taken 
   *           + The password does not match the requirements (8 chars min, 1 uppercase, 1 lowercase, 1 number, 1 special char)
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                errors:
   *                  type: array
   *                  items:
   *                    type: object
   *                    properties:
   *                      type:
   *                        type: string
   *                      value:
   *                        type: string
   *                      msg:
   *                        type: string
   *                      path:
   *                        type: string
   *                      location:
   *                        type: string
   *            example: {
   *               "errors": [
   *                   {
   *                       "type": "field",
   *                       "value": "",
   *                       "msg": "Username is required",
   *                       "path": "username",
   *                       "location": "body"
   *                   }
   *               ]
   *             }
   *       404:
   *         description: The user does not exist
   */
  app.patch('/api/users/:id', JwtAuthMiddleware, Validator(userUpdateRules), usersController.update)

  /**
   * @swagger
   * /api/users/{id}/avatar:
   *   put:
   *     summary: Update a user avatar
   *     description: Update a user avatar
   *     tags: [Users]
   *     security:
   *       - bearer: []
   *     consumes:
   *       - multipart/form-data
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *           required: true
   *       - in: formData
   *         name: file
   *         type: file
   *         description: The icon to upload
   *         required: true
   *
   *     responses:
   *      204:
   *        description: The user avatar has been updated
   *      404:
   *        description: The user does not exist
   */
  app.put('/api/users/:id/avatar', JwtAuthMiddleware, usersController.updatePicture)

  /**
   * @swagger
   * /api/users/{id}:
   *   delete:
   *     summary: Delete a user
   *     description: Delete a user if it is not the default one
   *     tags: [Users]
   *     security:
   *       - bearer: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *           required: true
   *     responses:
   *       204:
   *         description: The user has been deleted
   *       404:
   *         description: The user does not exist
   *
   */
  app.delete('/api/users/:id', JwtAuthMiddleware, usersController.delete)

  /**
   * WebSocket "routes" handler
   */
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
