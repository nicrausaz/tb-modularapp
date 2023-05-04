import express from 'express'
import { AuthController, ModulesController } from './controllers'
import { ModuleService, UserService } from './services'
import { UserRepository, ModuleRepository } from './repositories'
import authMiddleware from './middlewares/AuthMiddleware'
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

  // Create the services
  const userService = new UserService(userRepository)
  const moduleService = new ModuleService(modulesRepository)

  // Create the controllers
  const authController = new AuthController(userService)
  const modulesController = new ModulesController(moduleService)

  // Defines the routes used by the application
  // app.get('/', homeController.index)

  // Defines the routes used to expose the API for device interaction
  // app.get('/api', homeController.index)

  /**
   * Auth routes
   */
  app.post('/api/auth/login', authController.login)

  app.post('/api/auth/logout', authController.logout)

  /**
   * Modules routes
   */
  app.get('/api/modules', authMiddleware, modulesController.index)

  app.get('/api/modules/:id', authMiddleware, modulesController.module)

  app.get('/api/modules/:id/events', authMiddleware, modulesController.moduleEvents)

  app.get('/api/modules/:id/configuration', authMiddleware, modulesController.moduleConfiguration)

  app.put('/api/modules/:id/configuration', authMiddleware, modulesController.moduleConfigurationUpdate)
}

export default configureRoutes
