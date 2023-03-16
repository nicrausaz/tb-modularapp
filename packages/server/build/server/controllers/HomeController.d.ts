import { Request, Response } from 'express';
import { HomeRepository } from '../repositories';
export default class HomeController {
    private homeRepository;
    constructor(homeRepository: HomeRepository);
    index: (req: Request, res: Response) => void;
}
