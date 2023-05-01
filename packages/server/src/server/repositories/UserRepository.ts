import { LoginUserDTO } from '../models/DTO/UserDTO'
import { getDB } from '../../database/database'
import { User } from '../models/User'

export default class UserRepository {
  public getById(id: string) {
    return 'get by id'
  }

  public userAuthentification(loginUser: LoginUserDTO): Promise<User> {
    const db = getDB()

    return new Promise((resolve, reject) => {
      db.all(
        'SELECT id, username FROM users WHERE username = ? AND password = ?',
        [loginUser.username, loginUser.password],
        (err, row) => {
          if (err || row.length === 0) {
            reject(err)
          }
          resolve(row[0] as User)
        },
      )
      db.close()
    })
  }
}
