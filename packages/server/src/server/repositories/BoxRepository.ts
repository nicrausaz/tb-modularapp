import { getDB } from '../../database/database'
import { Box } from '../models/entities/Box'

export default class BoxRepository {
  get(): Promise<Box> {
    const db = getDB()
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM Box', (err, rows) => {
        if (err) {
          reject(err)
        }
        resolve(rows[0] as Box)
      })
      db.close()
    })
  }
}
