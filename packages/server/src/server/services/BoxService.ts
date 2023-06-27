import { UploadedFile } from 'express-fileupload'
import BoxMapper from '../mappers/BoxMapper'
import { BoxDTO } from '../models/DTO/BoxDTO'
import { BoxRepository } from '../repositories'

export default class BoxService {
  constructor(private boxRepository: BoxRepository) {}

  async getBox(): Promise<BoxDTO> {
    const box = await this.boxRepository.get()
    return BoxMapper.toDTO(box)
  }

  async updateBox(box: BoxDTO): Promise<BoxDTO> {
    throw new Error('Not implemented')
  }

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
