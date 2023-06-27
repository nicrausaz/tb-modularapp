import { BoxDTO } from "../models/DTO/BoxDTO";
import { Box } from "../models/entities/Box";

export default class BoxMapper {
  static toDTO(box: Box): BoxDTO {
    return {
      name: box.name,
      icon: box.icon,
      version: box.version,
    }
  }
}
