import { CreateUserDTO, LoginUserDTO, UpdateUserDTO } from '../models/DTO/UserDTO'
import { getDB } from '../../database/database'
import { UserEntity } from '../models/entities/User'
import { hashString, verifyString } from '../libs/security'
import { UploadedFile } from 'express-fileupload'

export default class UserRepository {
  public getById(id: string) {
    const db = getDB()

    return new Promise((resolve, reject) => {
      db.all('SELECT id, username, isDefault, avatar FROM Users WHERE id = ?', [id], (err, row) => {
        if (err || row.length === 0) {
          reject(err)
        }
        resolve(row[0])
      })
      db.close()
    })
  }

  public userAuthentification(loginUser: LoginUserDTO): Promise<UserEntity> {
    return new Promise((resolve, reject) => {
      this.getByUsername(loginUser.username)
        .then(async (user) => {
          // Verify password
          if (await verifyString(user.password, loginUser.password)) {
            resolve(user)
          }
          reject(null)
        })
        .catch(() => {
          reject(null)
        })
    })
  }

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

  public getUser(id: number): Promise<UserEntity> {
    const db = getDB()

    return new Promise((resolve, reject) => {
      db.all('SELECT id, username, isDefault FROM Users WHERE id = ?', [id], (err, row) => {
        if (err || row.length === 0) {
          reject(err)
        }
        resolve(row[0] as UserEntity)
      })
      db.close()
    })
  }

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

  public uploadPicture(file: UploadedFile) {
    console.log(file)
    return new Promise<void>((resolve, reject) => {
      file.mv(`${process.env.PUBLIC_DIR}/users/${file.name}`, async (err) => {
        if (err) {
          reject(err)
        }
        resolve()
      })
    })
  }

  private getByUsername(username: string): Promise<UserEntity> {
    const db = getDB()

    return new Promise((resolve, reject) => {
      db.all('SELECT id, username, password FROM Users WHERE username = ?', [username], (err, row) => {
        if (err || row.length === 0) {
          reject(err)
        }
        resolve(row[0] as UserEntity)
      })
      db.close()
    })
  }
}
