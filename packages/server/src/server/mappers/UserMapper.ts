import { UserDTO } from '../models/DTO/UserDTO'
import { UserEntity } from '../models/entities/User'

export default class UserMapper {
  static toDTO(user: UserEntity): UserDTO {
    return {
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      isDefault: user.isDefault,
    }
  }
}
