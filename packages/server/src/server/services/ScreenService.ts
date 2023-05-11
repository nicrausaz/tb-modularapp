import ScreenMapper from '../mappers/ScreenMapper'
import { ScreenDTO } from '../models/DTO/ScreenDTO'
import { ScreenRepository } from '../repositories'

export default class ScreenService {
  constructor(private screenRepository: ScreenRepository) {}

  async getScreens(): Promise<ScreenDTO[]> {
    const screens = await this.screenRepository.getAll()

    return screens.map((screen) => ScreenMapper.toDTO(screen))
  }

  async getScreen(id: string): Promise<ScreenDTO> {
    const screen = await this.screenRepository.getById(id)

    return ScreenMapper.toDTO(screen)
  }
}
