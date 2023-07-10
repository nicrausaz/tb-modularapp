import { UploadedFile } from 'express-fileupload'
import BoxMapper from '../mappers/BoxMapper'
import { APIKeyDTO, BoxDTO, CreateAPIKeyDTO } from '../models/DTO/BoxDTO'
import { BoxRepository } from '../repositories'
import { generateApiKey } from '../libs/security'
import { APIKeyNotFoundException } from '../exceptions/Box'

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

  /**
   * Get the API keys
   */
  async getAPIKeys(): Promise<APIKeyDTO[]> {
    return this.boxRepository.getAPIKeys()
  }

  /**
   * Generate a new API key
   */
  async generateAPIKey(createKey: CreateAPIKeyDTO): Promise<string> {
    const { key, hash } = await generateApiKey()

    const creation = {
      name: createKey.name,
      key: hash,
      display: key.substring(0, 5) + '∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗',
    }

    await this.boxRepository.createAPIKey(creation)
    return key
  }

  /**
   * Delete an API key
   */
  async deleteAPIKey(id: number) {
    if (!(await this.boxRepository.APIKeyExists(id))) {
      throw new APIKeyNotFoundException(id)
    }

    await this.boxRepository.deleteAPIKey(id)
  }
}
