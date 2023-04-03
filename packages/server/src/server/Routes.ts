import express from 'express'
import { HomeController, ModulesController } from './controllers'
import { HomeRepository } from './repositories'
import { Manager } from '@yalk/module-manager'

/**
 * Define all the routes for the application
 *
 * @param app The express application
 */
const configureRoutes = (app: express.Application, manager: Manager) => {
  // Create the repositories
  const homeRepository = new HomeRepository()
  // const modulesRepository = new ModulesController(manager)

  // Create the controllers
  const homeController = new HomeController(homeRepository)
  const modulesController = new ModulesController(manager)

  // Defines the routes used by the application
  app.get('/', homeController.index)

  // Defines the routes used to expose the API for device interaction
  app.get('/api', homeController.index)

  app.get('/api/modules', modulesController.index)

  app.get('/api/modules/:id', modulesController.module)

}

export default configureRoutes
