import { Request, Response } from 'express'
import { HomeRepository } from '../repositories'

export default class HomeController {
  constructor(private homeRepository: HomeRepository) {}

  index = (req: Request, res: Response) => {
    const response = this.homeRepository.hello() + ' This is the response from the index method in the HomeController'
    res.send(response)
  }
}
