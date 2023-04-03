import { join } from 'path'
import Server from './server/Server'

new Server(3000, join(__dirname, '../modules')).start()

// import express, { Request, Response } from 'express'
// import dotenv from 'dotenv'
// // import { dirWatcher, loadModulesFromDirectory } from './libs/modules'
// import path from 'path'
// import { Manager } from '@yalk/module-manager'

// dotenv.config()

// const app = express()
// const PORT = process.env.PORT
// const dirModules = path.join(__dirname, '..', 'modules')

// app.get('/', (req: Request, res: Response) => {
//   res.send(dirModules)
// })

// app.get('/modules', (req: Request, res: Response) => {
//   res.send('Modules ')
// })

// app.get('/modules/:id', (req: Request, res: Response) => {
//   res.send(`Module ${req.params.id   }`)
// })

// app.listen(PORT, () => {
//   console.log(`⚡ Server running on port ${PORT}`)
//   // loadModulesFromDirectory(dirModules)
//   // dirWatcher(dirModules)

//   // Manager.getInstance().start()
// })
