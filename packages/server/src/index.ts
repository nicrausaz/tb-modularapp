import { join } from 'path'
import Server from './server/Server'
import dotenv from 'dotenv'
import { buildDB } from './database/database'
import logger from './server/libs/logger'

dotenv.config()

const PORT = Number(process.env.PORT) || 3000

buildDB().then(() => {
  logger.info('Database ready')
  console.log(`
    _____       _     _            _____         
    |     |___ _| |_ _| |___ ___   |  _  |___ ___ 
    | | | | . | . | | | | .'|  _|  |     | . | . |
    |_|_|_|___|___|___|_|__,|_|    |__|__|  _|  _|
                                        |_| |_| v1.0.0
  `)

  new Server(PORT, join(__dirname, '../modules')).start()
})
