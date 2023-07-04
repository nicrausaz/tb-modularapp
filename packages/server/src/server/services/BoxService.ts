import { UploadedFile } from 'express-fileupload'
import BoxMapper from '../mappers/BoxMapper'
import { BoxDTO } from '../models/DTO/BoxDTO'
import { BoxRepository } from '../repositories'

export default class BoxService {
  constructor(private boxRepository: BoxRepository) {}

  /**
   * Get the box information
   */
  async getBox(): Promise<BoxDTO> {
    return BoxMapper.toDTO(await this.boxRepository.get())
  }

  /**
   * Update the box information
   */
  async updateBox(box: BoxDTO) {
    this.boxRepository.update(box)
  }

  /**
   * Update the box icon
   */
  async updateIcon(file: UploadedFile): Promise<string> {
    // Remove the old icon
    const box = await this.boxRepository.get()
    if (box.icon) {
      this.boxRepository.deleteIcon(box.icon)
    }

    // Upload the icon
    await this.boxRepository.uploadIcon(file)

    // Update the box icon in the database
    this.boxRepository.updateIcon(file.name)

    return file.name
  }
}
