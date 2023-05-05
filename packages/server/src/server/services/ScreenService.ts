import { ScreenRepository } from '../repositories'

export default class ScreenService {
  constructor(private screenRepository: ScreenRepository) {}

  getScreens() {
    return this.screenRepository.getAll()
  }

  getScreen(id: string) {
    return this.screenRepository.getById(id)
  }
}
