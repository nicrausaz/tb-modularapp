import { join } from 'path'
import Server from './server/Server'
import dotenv from 'dotenv'
import { buildDB } from './database/database'

dotenv.config()

const PORT = Number(process.env.PORT) || 3000

buildDB().then(() => {
  console.log('Database ready')
  new Server(PORT, join(__dirname, '../modules')).start()
})
