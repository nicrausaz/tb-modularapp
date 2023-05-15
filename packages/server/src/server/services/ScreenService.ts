import ScreenMapper from '../mappers/ScreenMapper'
import { ScreenDTO, UpdateScreenDTO } from '../models/DTO/ScreenDTO'
import { ScreenRepository } from '../repositories'

export default class ScreenService {
  constructor(private screenRepository: ScreenRepository) {}

  async getScreens(): Promise<ScreenDTO[]> {
    const screens = await this.screenRepository.getAll()
    return await Promise.all(screens.map((screen) => ScreenMapper.toDTO(screen)))
  }

  async getScreen(id: number): Promise<ScreenDTO | null> {
    const screen = await this.screenRepository.getById(id)
    return screen ? ScreenMapper.toDTO(screen) : null
  }

  async createOrUpdateScreen(screen: UpdateScreenDTO): Promise<void> {
    const screenEntity = ScreenMapper.screenUpdatetoEntity(screen)

    if (await this.screenRepository.exists(screen.id)) {
      await this.screenRepository.update(screenEntity)
    } else {
      await this.screenRepository.create(screenEntity)
    }
  }

  async deleteScreen(id: number): Promise<void> {
    await this.screenRepository.delete(id)
  }
}
