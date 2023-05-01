import { join } from 'path'
import Server from './server/Server'
import dotenv from 'dotenv'

dotenv.config()

const PORT = Number(process.env.PORT) || 3000

new Server(PORT, join(__dirname, '../modules')).start()
