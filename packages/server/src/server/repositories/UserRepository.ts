import { LoginUserDTO } from '../models/DTO/UserDTO'
import { getDB } from '../../database/database'
import { UserEntity } from '../models/entities/User'
import { hashString, verifyString } from '../libs/security'

export default class UserRepository {
  public getById(id: string) {
    const db = getDB()

    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
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

  public getByUsername(username: string): Promise<UserEntity> {
    const db = getDB()

    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err || row.length === 0) {
          reject(err)
        }
        resolve(row[0] as UserEntity)
      })
      db.close()
    })
  }

  public getUsers(): Promise<UserEntity[]> {
    const db = getDB()

    return new Promise((resolve, reject) => {
      db.all('SELECT id, username FROM users', (err, rows) => {
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
      db.all('SELECT id, username FROM users WHERE id = ?', [id], (err, row) => {
        if (err || row.length === 0) {
          reject(err)
        }
        resolve(row[0] as UserEntity)
      })
      db.close()
    })
  }

  public async createUser(user: LoginUserDTO): Promise<void> {
    const db = getDB()

    const hashedPassword = await hashString(user.password)

    return new Promise<void>((resolve, reject) => {
      db.run('INSERT INTO users (username, password) VALUES (?, ?)', [user.username, hashedPassword], (err) => {
        if (err) {
          reject(err)
        }
        resolve()
      })
      db.close()
    })
  }
}
