import express from 'express'
import { AuthController, HomeController, ModulesController } from './controllers'
import { ModulesService } from './services'
import { UserRepository, HomeRepository } from './repositories'
import { Manager } from '@yalk/module-manager'
import authMiddleware from './middlewares/AuthMiddleware'

/**
 * Define all the routes for the application
 *
 * @param app The express application
 */
const configureRoutes = (app: express.Application, manager: Manager) => {
  // Create the services
  // const moduleService = new ModulesService(manager)



  // Create the repositories
  const homeRepository = new HomeRepository()
  const userRepository = new UserRepository()
  const modulesRepository = new ModulesController(manager)

  // Create the controllers
  const authController = new AuthController(userRepository)
  const homeController = new HomeController(homeRepository)
  const modulesController = new ModulesController(manager)

  // Defines the routes used by the application
  app.get('/', homeController.index)

  // Defines the routes used to expose the API for device interaction
  app.get('/api', homeController.index)

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

  app.get('/api/modules/:id/configuration', authMiddleware, modulesController.moduleConfiguration)

  app.put('/api/modules/:id/configuration', authMiddleware, modulesController.moduleConfigurationUpdate)
}

export default configureRoutes
