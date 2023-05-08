import fs from 'fs'
import { Database } from 'sqlite3'

/**
 * Get a database connection
 * You will need to close the connection using db.close()
 * @returns a Database connection object
 */
const getDB = () => {
  return new Database('db.sqlite')
}

/**
 * Create the database structure
 */
const create = async () => {
  const db = getDB()
  return new Promise<void>((resolve, reject) => {
    // Create the database
    db.exec(fs.readFileSync(__dirname + '/model.sql').toString(), (err) => {
      if (err) {
        reject(err)
        return
      }
      resolve()
    })
    db.close()
  })
}

/**
 * Seed the database with initial data
 *
 */
const seed = async () => {
  const db = getDB()
  return new Promise<void>((resolve, reject) => {
    // Seed the database
    db.exec(fs.readFileSync(__dirname + '/seed.sql').toString(), (err) => {
      if (err) {
        reject(err)
        return
      }
      resolve()
    })
  })
}

/**
 * Create and seed the database
 */
const buildDB = async () => {
  return new Promise<void>((resolve, reject) => {
    create()
      .then(() => seed())
      .then(() => resolve())
      .catch((err) => reject(err))
  })
}

export { getDB, buildDB }
