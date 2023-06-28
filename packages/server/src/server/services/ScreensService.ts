import ScreenMapper from '../mappers/ScreenMapper'
import { ScreenDTO, UpdateScreenDTO } from '../models/DTO/ScreenDTO'
import { ScreensRepository } from '../repositories'

export default class ScreensService {
  constructor(private screensRepository: ScreensRepository) {}

  async getScreens(): Promise<ScreenDTO[]> {
    const screens = await this.screensRepository.getAll()
    return await Promise.all(screens.map((screen) => ScreenMapper.toDTO(screen)))
  }

  async getScreen(id: number): Promise<ScreenDTO | null> {
    const screen = await this.screensRepository.getById(id)
    return screen ? ScreenMapper.toDTO(screen) : null
  }

  async createOrUpdateScreen(screen: UpdateScreenDTO): Promise<number> {
    const screenEntity = ScreenMapper.screenUpdatetoEntity(screen)

    if (await this.screensRepository.exists(screen.id)) {
      return await this.screensRepository.update(screenEntity)
    }

    return await this.screensRepository.create(screenEntity)
  }

  async deleteScreen(id: number): Promise<void> {
    await this.screensRepository.delete(id)
  }
}
