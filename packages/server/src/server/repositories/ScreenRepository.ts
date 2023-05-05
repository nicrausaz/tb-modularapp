import { getDB } from '../../database/database'

export default class ScreenRepository {
  getAll() {
    const db = getDB()
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM Screen', (err, row) => {
        if (err) {
          reject(err)
        }
        resolve(row)
      })
      db.close()
    })
  }

  getById(id: string) {
    const db = getDB()
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM Screen WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err)
        }
        resolve(row)
      })
      db.close()
    })
  }

  create(screen: ScreenEntity) {
    
  }
}
