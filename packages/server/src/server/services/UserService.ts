import { UserRepository } from '../repositories'
import { LoginUserDTO } from '../models/DTO/UserDTO'
import { generateToken } from '../libs/jwt'


/**
 * The module service implements the business logic for the modules
 */
export default class UserService {
  constructor(private userRepository: UserRepository) {}

  authenticateUser = async (loginUser: LoginUserDTO) => {
    return this.userRepository.userAuthentification(loginUser)
      .then(user => {
        // Generate auth token
        const token = generateToken({
          id: user.id,
          username: user.username,
        })

        return token
      })
      .catch(() => {
        return null
      })
  }
}
