import { UploadedFile } from 'express-fileupload'
import { randomUUID } from 'crypto'
import { UsersRepository } from '../repositories'
import { CreateUserDTO, LoginUserDTO, UpdateUserDTO, UserDTO } from '../models/DTO/UserDTO'
import { generateToken } from '../libs/jwt'
import { verifyString } from '../libs/security'
import {
  UserAlreadyExistsException,
  UserAuthentificationFailedException,
  UserDeletionNotAllowedException,
  UserNotFoundException,
  UserUploadAvatarException,
} from '../exceptions/Users'
import UserMapper from '../mappers/UserMapper'

/**
 * The users service implements the business logic for the users
 */
export default class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  /**
   * Perform user authentication
   * @param loginUser the user credentials
   * @returns a JWT token if the user authentication is successful
   *
   * @throws UserAuthentificationFailedException if the user authentication failed
   */
  authenticateUser = async (loginUser: LoginUserDTO): Promise<string> => {
    return this.usersRepository.getByUsername(loginUser.username).then(async (user) => {
      // Verify password
      if (await verifyString(user.password, loginUser.password)) {
        return generateToken({
          id: user.id,
          username: user.username,
          avatar: user.avatar,
        })
      } else {
        throw new UserAuthentificationFailedException(loginUser.username)
      }
    })
  }

  /**
   * Get all users
   */
  getUsers = async (): Promise<UserDTO[]> => {
    return (await this.usersRepository.getUsers()).map(UserMapper.toDTO)
  }

  /**
   * Get a user by its id
   *
   * @throws UserNotFoundException if the user does not exist
   */
  getUser = async (id: number): Promise<UserDTO> => {
    if (!(await this.userExists(id))) {
      throw new UserNotFoundException(id)
    }

    return this.usersRepository.getById(id)
  }

  /**
   * Create a new user
   *
   * @throws UserAlreadyExistsException if the user already exists
   */
  createUser = async (user: CreateUserDTO): Promise<void> => {
    if (await this.userExistsByUsername(user.username)) {
      throw new UserAlreadyExistsException(user.username)
    }
    return this.usersRepository.createUser(user)
  }

  /**
   * Update an existing user
   *
   * @throws UserNotFoundException if the user does not exist
   */
  updateUser = async (id: number, user: UpdateUserDTO): Promise<void> => {
    if (!(await this.userExists(id))) {
      throw new UserNotFoundException(id)
    }

    // Check if the username is already taken
    const existingUser = await this.usersRepository.getByUsername(user.username)
    if (existingUser && existingUser.id !== id) {
      throw new UserAlreadyExistsException(user.username)
    }

    return this.usersRepository.updateUser(id, user)
  }

  /**
   * Delete an existing user
   *
   * @throws UserNotFoundException if the user does not exist
   * @throws UserDeletionNotAllowedException if the user is the default user
   */
  deleteUser = async (id: number): Promise<void> => {
    const user = await this.getUser(id)
    if (user.isDefault) {
      throw new UserDeletionNotAllowedException(id)
    }

    return this.usersRepository.deleteUser(id)
  }

  /**
   * Upload a user avatar and update the user
   *
   * @throws UserNotFoundException if the user does not exist
   */
  uploadAvatar = async (id: number, file: UploadedFile): Promise<void> => {
    if (!(await this.userExists(id))) {
      throw new UserNotFoundException(id)
    }

    file.name = `${randomUUID()}.${file.name.split('.').pop()}`

    return this.usersRepository
      .uploadAvatar(file)
      .then(() => this.usersRepository.updateUserAvatar(id, file.name))
      .catch(() => {
        throw new UserUploadAvatarException(id)
      })
  }

  /**
   * Check if a user exists by its id
   * @param id id of the user
   * @returns true if the user exists, false otherwise
   */
  private userExists = async (id: number): Promise<boolean> => {
    return this.usersRepository
      .getById(id)
      .then(() => true)
      .catch(() => false)
  }

  /**
   * Check if a user exists by its username
   * @param username username of the user
   * @returns true if the user exists, false otherwise
   */
  private userExistsByUsername = async (username: string): Promise<boolean> => {
    return this.usersRepository
      .getByUsername(username)
      .then(() => true)
      .catch(() => false)
  }
}
