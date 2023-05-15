import express from 'express'
import configureRoutes from './Routes'
import ModuleDatabaseManager from './helpers/ModuleDatabaseManager'
import { join } from 'path'
import { uploader } from './libs/file-upload'

export default class Server {
  private readonly app: express.Application
  private readonly manager: ModuleDatabaseManager

  constructor(readonly port: number, dirModules: string) {
    this.app = express()
    this.manager = new ModuleDatabaseManager(dirModules)

    // Configure app
    this.app.use(express.json())
    this.app.use(uploader)

    if (process.env.NODE_ENV === 'production') {
      this.app.use(express.static(join(__dirname, '../', 'public')))
    }

    // Bind router
    configureRoutes(this.app, this.manager)
  }

  start() {
    const srv = this.app.listen(this.port, () => {
      console.log(`⚡ Server running on port ${this.port}`)
    })

    // Handle process exit
    process.on('SIGINT', () => {
      this.manager.stop()
      srv.close()
      console.log('Modules stopped & Server closed')
    })
  }
}
