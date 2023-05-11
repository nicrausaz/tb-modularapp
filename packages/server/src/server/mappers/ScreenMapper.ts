import { ScreenDTO } from "../models/DTO/ScreenDTO";
import { ScreenEntity } from "../models/entities/Screen";

export default class ScreenMapper {
  static toDTO(screen: ScreenEntity): ScreenDTO {
    return {
      id: screen.id,
      name: screen.name,
      slots: []
    }
  }
}
