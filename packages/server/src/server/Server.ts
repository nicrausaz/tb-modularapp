import express from 'express'
import WebSocket from 'ws'
import configureRoutes from './Routes'
import ModuleDatabaseManager from './helpers/ModuleDatabaseManager'
import { join } from 'path'
import { uploader } from './libs/file-upload'
import { ErrorMiddleware } from './middlewares/ErrorMiddleware'
import logger from './libs/logger'
import { swaggerSpec } from './libs/swagger/swagger'
import swaggerUi from 'swagger-ui-express'

export default class Server {
  private readonly app: express.Application
  private wss!: WebSocket.Server
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

    // Configure WebSocket server
    this.wss = new WebSocket.Server({ noServer: true, path: '/events' })

    // Bind router
    configureRoutes(this.app, this.manager, this.wss)

    // Bind swagger
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

    // Bind error middleware
    this.app.use(ErrorMiddleware)
  }

  start() {
    // Start the HTTP server
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
