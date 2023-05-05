import express from 'express'
import { AuthController, ModulesController, ScreenController } from './controllers'
import { ModuleService, ScreenService, UserService } from './services'
import { UserRepository, ModuleRepository, ScreenRepository } from './repositories'
import { JwtAuthMiddleware } from './middlewares/AuthMiddleware'
import ModuleDatabaseManager from './helpers/ModuleDatabaseManager'

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

  // Create the services
  const userService = new UserService(userRepository)
  const moduleService = new ModuleService(modulesRepository)
  const screenService = new ScreenService(screenRepository)

  // Create the controllers
  const authController = new AuthController(userService)
  const modulesController = new ModulesController(moduleService)
  const screensController = new ScreenController(screenService)

  // Defines the routes used by the application
  // app.get('/', homeController.index)

  // Defines the routes used to expose the API for device interaction
  // app.get('/api', homeController.index)

  /**
   * Auth routes
   */
  app.post('/api/auth/login', authController.login)

  app.post('/api/auth/logout', authController.logout)

  app.get('/api/auth/me', JwtAuthMiddleware, authController.me)

  /**
   * Modules routes
   */
  app.get('/api/modules', JwtAuthMiddleware, modulesController.index)

  app.get('/api/modules/:id', JwtAuthMiddleware, modulesController.module)

  app.get('/api/modules/:id/events', JwtAuthMiddleware, modulesController.moduleEvents)

  app.get('/api/modules/:id/configuration', JwtAuthMiddleware, modulesController.moduleConfiguration)

  app.put('/api/modules/:id/configuration', JwtAuthMiddleware, modulesController.moduleConfigurationUpdate)

  // app.post('api/modules/:id/events', JwtAuthMiddleware, modulesController.moduleEventCreate)

  app.post('/api/modules/:id/status', JwtAuthMiddleware, modulesController.moduleStatusUpdate)

  /**
   * Screens routes
   */
  app.get('/api/screens', screensController.index)

  app.get('/api/screens/:id', screensController.screen)

  app.put('/api/screens/:id', screensController.createOrUpdate)

  app.delete('/api/screens/:id', screensController.delete)
}

export default configureRoutes
