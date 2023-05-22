import BoxMapper from '../mappers/BoxMapper'
import { BoxDTO } from '../models/DTO/BoxDTO'
import { BoxRepository } from '../repositories'

export default class BoxService {
  constructor(private boxRepository: BoxRepository) {}

  async getBox(): Promise<BoxDTO> {
    const box = await this.boxRepository.get()
    return BoxMapper.toDTO(box)
  }

  
}
