import { UploadedFile } from 'express-fileupload'
import { randomUUID } from 'crypto'
import { UsersRepository } from '../repositories'
import { CreateUserDTO, LoginUserDTO, UpdateUserDTO } from '../models/DTO/UserDTO'
import { generateToken } from '../libs/jwt'
import { ForbiddenError, NotFoundError } from '../middlewares/HTTPError'

/**
 * The users service implements the business logic for the users
 */
export default class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  authenticateUser = async (loginUser: LoginUserDTO) => {
    return this.usersRepository
      .userAuthentification(loginUser)
      .then((user) => {
        // Generate auth token
        const token = generateToken({
          id: user.id,
          username: user.username,
          avatar: user.avatar,
        })

        return token
      })
      .catch(() => {
        return null
      })
  }

  getUsers = async () => {
    return this.usersRepository.getUsers()
  }

  getUser = async (id: number) => {
    return this.usersRepository.getUser(id)
  }

  createUser = async (user: CreateUserDTO) => {
    return this.usersRepository.createUser(user)
  }

  updateUser = async (id: number, user: UpdateUserDTO) => {
    return this.usersRepository.updateUser(id, user)
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

        return this.usersRepository.deleteUser(id)
      })
      .catch((err) => {
        throw err
      })
  }

  uploadPicture = async (id: number, file: UploadedFile) => {
    file.name = `${randomUUID()}.${file.name.split('.').pop()}`

    return this.usersRepository
      .uploadPicture(file)
      .then(() => this.usersRepository.updateUserAvatar(id, file.name))
      .catch((err) => console.log(err, 'todo'))
  }
}
