import express from 'express'
import configureRoutes from './Routes'
import ModuleDatabaseManager from './helpers/ModuleDatabaseManager'

export default class Server {
  private readonly app: express.Application
  private readonly manager: ModuleDatabaseManager
  // private readonly manager: Manager

  constructor(readonly port: number, dirModules: string) {
    this.app = express()
    this.manager = new ModuleDatabaseManager(dirModules)

    // Configure app
    this.app.use(express.json())

    configureRoutes(this.app, this.manager)
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`⚡ Server running on port ${this.port}`)
    })
  }
}
