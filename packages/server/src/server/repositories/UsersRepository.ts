import { CreateUserDTO, UpdateUserDTO } from '../models/DTO/UserDTO'
import { getDB } from '../../database/database'
import { UserEntity } from '../models/entities/User'
import { hashString } from '../libs/security'
import { UploadedFile } from 'express-fileupload'

export default class UsersRepository {
  /**
   * Get a user by its id
   * @param id id of the user
   * @returns the user
   */
  public getById(id: number): Promise<UserEntity> {
    const db = getDB()
    return new Promise((resolve, reject) => {
      db.all('SELECT id, username, isDefault, avatar FROM Users WHERE id = ?', [id], (err, row) => {
        if (err || row.length === 0) {
          reject(err)
        }
        resolve(row[0] as UserEntity)
      })
      db.close()
    })
  }

  /**
   * Get all users
   * @returns all users
   */
  public getUsers(): Promise<UserEntity[]> {
    const db = getDB()
    return new Promise((resolve, reject) => {
      db.all('SELECT id, username, isDefault, avatar FROM Users', (err, rows) => {
        if (err) {
          reject(err)
        }
        resolve(rows as UserEntity[])
      })
      db.close()
    })
  }

  /**
   * Create a new user
   * Will hash the password before storing it in the database
   * @param user user to create
   */
  public async createUser(user: CreateUserDTO): Promise<void> {
    const db = getDB()
    const hashedPassword = await hashString(user.password)

    return new Promise<void>((resolve, reject) => {
      db.run('INSERT INTO Users (username, password) VALUES (?, ?)', [user.username, hashedPassword], (err) => {
        if (err) {
          reject(err)
        }
        resolve()
      })
      db.close()
    })
  }

  /**
   * Update an existing user.
   * Will hash the password before storing it in the database, if it is provided
   * @param id id of the user to update
   * @param user user data to update
   */
  public async updateUser(id: number, user: UpdateUserDTO): Promise<void> {
    const db = getDB()

    let query = 'UPDATE Users SET username = ?'
    const params = [user.username]

    if (user.password) {
      query += ', password = ?'
      params.push(await hashString(user.password))
    }

    query += ' WHERE id = ?'
    params.push(id.toString())

    return new Promise<void>((resolve, reject) => {
      db.run(query, params, (err) => {
        if (err) {
          reject(err)
        }
        resolve()
      })
      db.close()
    })
  }

  /**
   * Update the avatar of a user
   * @param id user id
   * @param avatar avatar filename
   */
  public async updateUserAvatar(id: number, avatar: string): Promise<void> {
    const db = getDB()

    return new Promise<void>((resolve, reject) => {
      db.run('UPDATE Users SET avatar = ? WHERE id = ?', [avatar, id], (err) => {
        if (err) {
          reject(err)
        }
        resolve()
      })
      db.close()
    })
  }

  /**
   * Delete a user
   * @param id user id to delete
   */
  public async deleteUser(id: number): Promise<void> {
    const db = getDB()
    return new Promise<void>((resolve, reject) => {
      db.run('DELETE FROM Users WHERE id = ?', [id], (err) => {
        if (err) {
          reject(err)
        }
        resolve()
      })
      db.close()
    })
  }

  /**
   * Upload user avatar
   * @param file avatar to upload
   */
  public uploadAvatar(file: UploadedFile): Promise<void> {
    return new Promise((resolve, reject) => {
      file.mv(`${process.env.PUBLIC_DIR}/users/${file.name}`, async (err) => {
        if (err) {
          reject(err)
        }
        resolve()
      })
    })
  }

  /**
   * Get a user by its username
   * @param username username of the user
   * @returns the user
   */
  public getByUsername(username: string): Promise<UserEntity> {
    const db = getDB()
    return new Promise((resolve, reject) => {
      db.all('SELECT id, username, password, avatar FROM Users WHERE username = ?', [username], (err, row) => {
        if (err || row.length === 0) {
          reject(err)
        }
        resolve(row[0] as UserEntity)
      })
      db.close()
    })
  }
}
