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

const createAndSeed = () => {
  const db = getDB()

  // Create the database
  db.exec(fs.readFileSync(__dirname + '/model.sql').toString(), (err) => {
    if (err) {
      console.error(err)
      return
    }
    console.log('Database created')
  })

  // Seed the database
  db.exec(fs.readFileSync(__dirname + '/seed.sql').toString(), (err) => {
    if (err) {
      console.error(err)
      return
    }
    console.log('Database seeded')
  })
}

export { getDB, createAndSeed }
