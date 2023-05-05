import { LoginUserDTO } from '../models/DTO/UserDTO'
import { getDB } from '../../database/database'
import { UserEntity } from '../models/User'
import { verifyString } from '../libs/security'

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
}
