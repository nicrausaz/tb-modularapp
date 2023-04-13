import express from 'express'
import configureRoutes from './Routes'
import { Manager } from '@yalk/module-manager'
// import "../database/database"

export default class Server {
  private readonly app: express.Application
  private readonly manager: Manager

  constructor(readonly port: number, dirModules: string) {
    this.app = express()
    this.manager = new Manager(dirModules)
    // this.manager.start()
    this.manager.loadModulesFromPath().then(() => {
      this.manager.start()
    })

    this.manager.on('event', (data) => {
      // console.log('got data in server', data)
    })

    configureRoutes(this.app, this.manager)
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`⚡ Server running on port ${this.port}`)
    })
  }
}
