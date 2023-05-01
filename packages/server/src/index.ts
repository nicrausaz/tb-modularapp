import { join } from 'path'
import Server from './server/Server'
import dotenv from 'dotenv'
import { createAndSeed } from './database/database'

dotenv.config()

const PORT = Number(process.env.PORT) || 3000

createAndSeed()

new Server(PORT, join(__dirname, '../modules')).start()
