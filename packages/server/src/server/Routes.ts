import express, { Request, Response } from 'express'
import { AuthController, BoxController, ModulesController, ScreensController, UsersController } from './controllers'
import { BoxService, ModulesService, ScreensService, UsersService } from './services'
import { UsersRepository, ModulesRepository, ScreensRepository, BoxRepository } from './repositories'
import { JwtAuthMiddleware } from './middlewares/AuthMiddleware'
import ModuleDatabaseManager from './helpers/ModuleDatabaseManager'
import { join } from 'path'
import {
  boxUpdateRules,
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

  // Defines the routes used by the application
  app.get('/', (req: Request, res: Response) => {
    if (process.env.NODE_ENV === 'production') {
      res.sendFile(join(__dirname, '../public', 'index.html'))
    } else {
      res.send('The app is running in development mode')
    }
  })

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

  app.patch('/api/modules/:id', Validator(moduleUpdateRules), JwtAuthMiddleware, modulesController.update)

  // app.get('/api/modules/:id/events', modulesController.moduleEvents)

  app.post('/api/modules/:id/events', JwtAuthMiddleware, modulesController.sendEvent)

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

  app.put(
    '/api/modules/:id/configuration',
    Validator(moduleConfigurationUpdateRules),
    JwtAuthMiddleware,
    modulesController.moduleConfigurationUpdate,
  )

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
   *     responses:
   *       200:
   *         description: Module enabled or disabled
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
   *                          "message": "Module enabled successfully",
   *                          "moduleId": "1344ca73-5bd2-472e-a75d-45d2c6c5f7a0"
   *                       }
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
  app.get('/api/screens', JwtAuthMiddleware, screensController.index)

  app.get('/api/screens/:id', screensController.screen)

  // app.get('/api/screens/:id/events', screensController.screenEvents)

  app.put('/api/screens/:id', Validator(screenUpdateRules), JwtAuthMiddleware, screensController.createOrUpdate)

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
