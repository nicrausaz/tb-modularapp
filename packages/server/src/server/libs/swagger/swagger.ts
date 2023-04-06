import SwaggerJsdoc from 'swagger-jsdoc'
import SwaggerUi from 'swagger-ui-express'

const swaggerOptions = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Modular App API',
      version: '1.0.0',
      description: 'API for the Modular App',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
}

const specs = SwaggerJsdoc(swaggerOptions)

const configureSwagger = (app) => {
  app.use('/api-docs', SwaggerUi.serve, SwaggerUi.setup(specs))
}

export default configureSwagger

