import { UserRepository } from '../repositories'
import { CreateUserDTO, LoginUserDTO, UpdateUserDTO } from '../models/DTO/UserDTO'
import { generateToken } from '../libs/jwt'
import { ForbiddenError, NotFoundError } from '../middlewares/HTTPError'

/**
 * The module service implements the business logic for the modules
 */
export default class UserService {
  constructor(private userRepository: UserRepository) {}

  authenticateUser = async (loginUser: LoginUserDTO) => {
    return this.userRepository
      .userAuthentification(loginUser)
      .then((user) => {
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

  getUsers = async () => {
    return this.userRepository.getUsers()
  }

  getUser = async (id: number) => {
    return this.userRepository.getUser(id)
  }

  createUser = async (user: CreateUserDTO) => {
    return this.userRepository.createUser(user)
  }

  updateUser = async (id: number, user: UpdateUserDTO) => {
    return this.userRepository.updateUser(id, user)
  }

  deleteUser = async (id: number) => {
    return this.getUser(id)
      .then((user) => {
        if (!user) {
          throw new NotFoundError('User not found')
        }

        if (user.isDefault) {
          throw new ForbiddenError('Cannot delete the default user')
        }

        return this.userRepository.deleteUser(id)
      })
      .catch((err) => {
        throw err
      })
  }
}
