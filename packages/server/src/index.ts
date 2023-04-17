import { join } from 'path'
import Server from './server/Server'

new Server(3000, join(__dirname, '../modules')).start()
