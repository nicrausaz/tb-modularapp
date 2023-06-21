import fs from 'fs'
import { join } from 'path'
import { Database } from 'sqlite3'
import logger from '../server/libs/logger'

/**
 * Get a database connection
 * You will need to close the connection using db.close()
 * @returns a Database connection object
 */
const getDB = () => {
  return new Database(join(process.env.DB_DIR || '', 'db.sqlite'))
}

/**
 * Create the database structure
 */
const create = async () => {
  const db = getDB()
  return new Promise<void>((resolve, reject) => {
    // Create the database
    db.exec(fs.readFileSync(join(process.env.DB_DIR || '', 'model.sql')).toString(), (err) => {
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
    db.exec(fs.readFileSync(join(process.env.DB_DIR || '', 'seed.sql')).toString(), (err) => {
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
  const shouldSeed = !fs.existsSync(join(process.env.DB_DIR || '', 'db.sqlite'))

  return new Promise<void>((resolve, reject) => {
    create()
      .then(() => {
        logger.info('Database created')
        if (shouldSeed) seed()
      })
      .then(() => resolve())
      .catch((err) => {
        logger.emerg('Fatal error during database initialization: %s', err)
        reject(err)
      })
  })
}

export { getDB, buildDB }
