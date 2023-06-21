import { join } from 'path'
import Server from './server/Server'
import dotenv from 'dotenv'
import { buildDB } from './database/database'
import logger from './server/libs/logger'

dotenv.config()

const PORT = Number(process.env.PORT) || 3000

buildDB().then(() => {
  logger.info('Database ready')
  new Server(PORT, join(__dirname, '../modules')).start()
})
