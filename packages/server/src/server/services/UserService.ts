import { UserRepository } from '../repositories'
import { LoginUserDTO } from '../models/DTO/UserDTO'

/**
 * The module service implements the business logic for the modules
 */
export default class UserService {
  constructor(private userRepository: UserRepository) {}

  authenticateUser = (loginUser: LoginUserDTO) => {


  }
}
