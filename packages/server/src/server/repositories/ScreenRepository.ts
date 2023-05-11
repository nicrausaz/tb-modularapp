import { getDB } from '../../database/database'
import { ScreenEntity } from '../models/entities/Screen'

export default class ScreenRepository {
  getAll(): Promise<ScreenEntity[]> {
    const db = getDB()
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM Screens', (err, rows) => {
        if (err) {
          reject(err)
        }
        resolve(rows as ScreenEntity[])
      })
      db.close()
    })
  }

  getById(id: string): Promise<ScreenEntity> {
    const db = getDB()
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM Screens WHERE id = ?', [id], (err, rows) => {
        if (err || rows.length === 0) {
          reject(err)
        }
        resolve(rows[0] as ScreenEntity)
      })
      db.close()
    })
  }

  create(screen: ScreenEntity) {
    //
  }
}
