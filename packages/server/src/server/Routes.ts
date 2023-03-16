import express from 'express'
import HomeController from './controllers/HomeController'
import { HomeRepository } from './repositories'

/**
 * Define all the routes for the application
 *
 * @param app The express application
 */
const configureRoutes = (app: express.Application) => {
  // Create the repositories
  const homeRepository = new HomeRepository()

  // Create the controllers
  const homeController = new HomeController(homeRepository)

  // Defines the routes used by the application
  app.get('/', homeController.index)

  // Defines the routes used to expose the API for device interaction
  app.get('/api', homeController.index)
}

export default configureRoutes
