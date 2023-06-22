import express, { Request, Response } from 'express'
import { AuthController, ModulesController, ScreenController, BoxController } from './controllers'
import { BoxService, ModuleService, ScreenService, UserService } from './services'
import { UserRepository, ModuleRepository, ScreenRepository, BoxRepository } from './repositories'
import { JwtAuthMiddleware } from './middlewares/AuthMiddleware'
import ModuleDatabaseManager from './helpers/ModuleDatabaseManager'
import { join } from 'path'
import UserController from './controllers/UserController'

/**
 * Define all the routes for the application
 *
 * @param app The express application
 */
const configureRoutes = (app: express.Application, manager: ModuleDatabaseManager) => {
  // Create the repositories
  const userRepository = new UserRepository()
  const modulesRepository = new ModuleRepository(manager)
  const screenRepository = new ScreenRepository()
  const boxRepository = new BoxRepository()

  // Create the services
  const userService = new UserService(userRepository)
  const moduleService = new ModuleService(modulesRepository)
  const screenService = new ScreenService(screenRepository)
  const boxService = new BoxService(boxRepository)

  // Create the controllers
  const authController = new AuthController(userService)
  const modulesController = new ModulesController(moduleService)
  const screensController = new ScreenController(screenService)
  const boxController = new BoxController(boxService)
  const userController = new UserController(userService)

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
  app.post('/api/auth/login', authController.login)

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
   *     summary: Get the connected user information
   *     description: Decode the JWT token and return the user information
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
   *                 id:
   *                   type: number
   *                 username:
   *                   type: string
   *                 iat:
   *                   type: number
   *                 exp:
   *                   type: number
   *             example: {
   *                           "id": "1344ca73-5bd2-472e-a75d-45d2c6c5f7a0",
   *                           "name": "ZIP-Module",
   *                           "description": "A module used for debug",
   *                           "author": "Test",
   *                           "version": "1.0.0",
   *                           "icon": "debug.png",
   *                           "nickname": null,
   *                           "enabled": false,
   *                           "importedAt": "2023-06-22 08:08:47"
   *                       }
   */
  app.get('/api/modules', JwtAuthMiddleware, modulesController.index)

  app.post('/api/modules', JwtAuthMiddleware, modulesController.upload)

  app.get('/api/modules/:id', JwtAuthMiddleware, modulesController.module)

  app.delete('/api/modules/:id', JwtAuthMiddleware, modulesController.delete)

  app.get('/api/modules/:id/events', modulesController.moduleEvents)

  app.post('/api/modules/:id/events', JwtAuthMiddleware, modulesController.sendEvent)

  app.get('/api/modules/:id/configuration', JwtAuthMiddleware, modulesController.moduleConfiguration)

  app.put('/api/modules/:id/configuration', JwtAuthMiddleware, modulesController.moduleConfigurationUpdate)

  app.post('/api/modules/:id/status', JwtAuthMiddleware, modulesController.moduleStatusUpdate)

  /**
   * Screens routes
   */
  app.get('/api/screens', JwtAuthMiddleware, screensController.index)

  app.get('/api/screens/:id', screensController.screen)

  app.put('/api/screens/:id', JwtAuthMiddleware, screensController.createOrUpdate)

  app.delete('/api/screens/:id', JwtAuthMiddleware, screensController.delete)

  /**
   * Box routes
   */
  app.get('/api/box', JwtAuthMiddleware, boxController.index)

  app.get('/api/box/static/:filename', boxController.staticFile)

  app.post('api/box', JwtAuthMiddleware, boxController.update)

  /**
   * User routes
   */

  app.get('/api/users', JwtAuthMiddleware, userController.index)

  app.post('/api/users', JwtAuthMiddleware, userController.create)

  app.patch('/api/users/:id', JwtAuthMiddleware, userController.update)

  app.delete('/api/users/:id', JwtAuthMiddleware, userController.delete)
}

export default configureRoutes
