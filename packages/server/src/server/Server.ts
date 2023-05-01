import express from 'express'
import configureRoutes from './Routes'
import { Manager } from '@yalk/module-manager'
import '../database/database'

export default class Server {
  private readonly app: express.Application
  private readonly manager: Manager

  constructor(readonly port: number, dirModules: string) {
    this.app = express()
    this.manager = new Manager(dirModules)

    // Configure app
    this.app.use(express.json())

    // Load existing modules, then start them all
    // TODO: this will need to be done according to the database
    this.manager.loadModulesFromPath().then(() => {
      this.manager.start()
    })

    configureRoutes(this.app, this.manager)
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`⚡ Server running on port ${this.port}`)
    })
  }
}
