import swaggerJSDoc from 'swagger-jsdoc'
import * as path from 'path'

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Modular App API',
      version: '1.0.0',
      description: 'This is the API documentation for the Modular APP',
    },
    components: {
      securitySchemes: {
        bearer: {
          type: 'http',
          scheme: 'bearer',
        },
        apikey: {
          type: 'apiKey',
          name: 'x-api-key',
        }
      },
    },
  },
  apis: [path.join(__dirname, '../../Routes.ts')],
})

export { swaggerSpec }
