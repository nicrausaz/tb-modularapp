import { Request, Response } from 'express'
import { Manager } from '@yalk/module-manager'
import { renderToStaticMarkup } from 'react-dom/server'

export default class ModulesController {
  constructor(/* private homeRepository: ModulesRepository */ private manager: Manager) {}

  /**
   * GET
   * Get all the modules
   */
  index = (req: Request, res: Response) => {
    const mods = this.manager.getModules().map((m) => {
      return {
        name: m.name,
        version: m.version,
        description: m.description,
      }
    })
    res.send(mods)
  }

  /**
   * GET
   * Register to a module's events trough SSE
   */
  module = (req: Request, res: Response) => {
    // Get the module
    const module = this.manager.getModule(req.params.id)

    // TODO: here SSR the module render, pass the props and send the html
    // with the event stream data

    if (!module) {
      res.status(404).send('Module not found')
      return
    }

    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    res.write(`data: Current time is ${new Date().toLocaleTimeString()}\n\n`)

    // Envoi périodique de données SSE
    const intervalId = setInterval(() => {
      res.write(`data: Current time is ${new Date().toLocaleTimeString()}\n\n`)
    }, 5000)

    // Gestion de la fin de la connexion SSE
    req.on('close', () => {
      clearInterval(intervalId)
    })
  }

  /**
   * GET
   * Get a module's configuration
   */
  moduleConfiguration = (req: Request, res: Response) => {
    const module = this.manager.getModule(req.params.id)
    res.send(module!.toDTO())
  }

  /**
   * POST
   * Update a module's configuration
   */
  moduleConfigurationUpdate = (req: Request, res: Response) => {
    res.send({
      fields: [
        {
          name: 'test',
          type: 'text',
        },
      ],
    })
  }

  moduleRender = async (req: Request, res: Response) => {
    console.log(req.params.id)
    // Get the module
    // eslint-disable-next-line
    // @ts-ignore
    const M = await import('../../../modules/hello-module/app')

    // console.log(M.default())

    const html = renderToStaticMarkup(M.default({ name: 'Nicolas' }))
    res.send(html)

    // const { pipe } = renderToPipeableStream(M.default(), {
    //   onShellReady() {
    //     res.setHeader('content-type', 'text/html');
    //     pipe(res);
    //   }
    // });
  }
}
