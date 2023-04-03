import { Request, Response } from 'express'
import { HomeRepository } from '../repositories'

export default class HomeController {
  constructor(private homeRepository: HomeRepository) {}

  private emitSSE = (res: any, id: any, data: any) => {
    res.write('id: ' + id + '\n')
    res.write('data: ' + data + '\n\n')
    res.flush()
  }

  index = (req: Request, res: Response) => {
    // const response = this.homeRepository.hello() + ' This is the response from the index method in the HomeController'
    // res.send(response)

    // Path is in the app folder

    // res.sendFile(path.join(__dirname, '..', '..', '..', '..', 'app', 'src', 'renderer', 'index.html'))
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
  
    // Envoi des données SSE
    res.write(`data: Hello, world!\n\n`);
    
    // Envoi périodique de données SSE
    const intervalId = setInterval(() => {
      res.write(`data: Current time is ${new Date().toLocaleTimeString()}\n\n`);
    }, 1000);
  
    // Gestion de la fin de la connexion SSE
    req.on('close', () => {
      clearInterval(intervalId);
    });
  }
}
