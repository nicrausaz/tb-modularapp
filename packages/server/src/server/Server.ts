import express from 'express'
import configureRoutes from './Routes'

export default class Server {
  private app: express.Application

  constructor(readonly port: number) {
    this.app = express()
    configureRoutes(this.app)
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`⚡ Server running on port ${this.port}`)
    })
  }
}