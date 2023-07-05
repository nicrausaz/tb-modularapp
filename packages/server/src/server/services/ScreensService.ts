import { ScreenDisabledException, ScreenNotDeletableException, ScreenNotFoundException } from '../exceptions/Screens'
import ScreenLiveUpdater from '../helpers/ScreenLiveUpdater'
import ScreenMapper from '../mappers/ScreenMapper'
import { ScreenDTO, UpdateScreenDTO } from '../models/DTO/ScreenDTO'
import { ScreensRepository } from '../repositories'

/**
 * The screens service implements the business logic for the screens
 */
export default class ScreensService {
  constructor(private screensRepository: ScreensRepository, private screenUpdater: ScreenLiveUpdater) {}

  /**
   * Get all screens
   */
  async getScreens(): Promise<ScreenDTO[]> {
    const screens = await this.screensRepository.getAll()
    return await Promise.all(screens.map((screen) => ScreenMapper.toDTO(screen)))
  }

  /**
   * Get a screen by its id if it exists and is enabled
   *
   * @throws ScreenNotFoundException if the screen does not exist
   * @throws ScreenDisabledException if the screen is not enabled
   */
  async getScreen(id: number): Promise<ScreenDTO> {
    if (!(await this.screensRepository.exists(id))) {
      throw new ScreenNotFoundException(id)
    }

    const screen = await this.screensRepository.getById(id)

    if (!screen.enabled) {
      throw new ScreenDisabledException(id)
    }

    return ScreenMapper.toDTO(screen)
  }

  /**
   * Create or update a screen and its slots
   */
  async createOrUpdateScreen(screen: UpdateScreenDTO): Promise<void> {
    const screenEntity = ScreenMapper.screenUpdatetoEntity(screen)

    if (await this.screensRepository.exists(screen.id)) {
      await this.screensRepository.update(screenEntity)
    } else {
      await this.screensRepository.create(screenEntity)
    }
    this.screenUpdater.notifyChange(screen.id)
  }

  /**
   * Delete a screen and its slots if it exists
   *
   * @throws ScreenNotFoundException if the screen does not exist
   */
  async deleteScreen(id: number): Promise<void> {
    if (!(await this.screensRepository.exists(id))) {
      throw new ScreenNotFoundException(id)
    }

    if ((await this.screensRepository.getScreenCount()) === 1) {
      throw new ScreenNotDeletableException(id)
    }

    await this.screensRepository.delete(id)
    this.screenUpdater.notifyChange(id)
  }

  /**
   * Subscribe to screen updates
   * @param screenId id of the screen to subscribe to
   * @param callback callback to call when the screen is updated
   */
  subscribeToScreen(screenId: number, callback: () => void) {
    this.screenUpdater.subscribe(screenId, callback)
  }

  /**
   * Unsubscribe from screen updates
   * @param screenId id of the screen to unsubscribe from
   * @param callback callback to remove from the listeners
   */
  unsubscribeFromScreen(screenId: number, callback: () => void) {
    this.screenUpdater.unsubscribe(screenId, callback)
  }
}
