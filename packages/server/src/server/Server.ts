import express from 'express'
import WebSocket from 'ws'
import configureRoutes from './Routes'
import ModuleDatabaseManager from './helpers/ModuleDatabaseManager'
import { uploader } from './libs/file-upload'
import { ErrorMiddleware } from './middlewares/ErrorMiddleware'
import logger from './libs/logger'
import compression from 'compression'
import { swaggerSpec } from './libs/swagger/swagger'
import swaggerUi from 'swagger-ui-express'

export default class Server {
  private readonly app: express.Application
  private wss!: WebSocket.Server
  private readonly manager: ModuleDatabaseManager

  constructor(readonly port: number, dirModules: string) {
    this.app = express()
    this.manager = new ModuleDatabaseManager(dirModules)

    this.app.use(compression())
    // Configure app
    this.app.use(express.json())
    this.app.use(uploader)

    // Configure WebSocket server
    this.wss = new WebSocket.Server({ noServer: true, path: '/events' })

    // Bind swagger
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

    // Bind router
    configureRoutes(this.app, this.manager, this.wss)

    // Bind error middleware
    this.app.use(ErrorMiddleware)
  }

  start() {
    const srv = this.app.listen(this.port, () => {
      logger.info(`Server running on port http://localhost:${this.port}`)
    })

    // Bind WebSocket server to HTTP server (for WS upgrade)
    srv.on('upgrade', (request, socket, head) => {
      this.wss.handleUpgrade(request, socket, head, (socket) => {
        this.wss.emit('connection', socket, request)
      })
    })

    // Handle process exit
    process.on('SIGINT', () => {
      this.manager.stop()
      srv.close()
      this.wss.close()
      logger.info(`Modules stopped & Server closed`)
    })
  }
}
