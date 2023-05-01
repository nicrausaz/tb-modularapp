import fs from 'fs'
import { Database } from 'sqlite3'

// Open a SQLite database, stored in the file db.sqlite
const db = new Database('db.sqlite')

db.exec(fs.readFileSync(__dirname + '/model.sql').toString(), (err) => {
  if (err) {
    console.error(err)
    return
  }
  console.log('Database created')
})

db.exec(fs.readFileSync(__dirname + '/seed.sql').toString(), (err) => {
  if (err) {
    console.error(err)
    return
  }
  console.log('Database seeded')
})

/**
 * Get a database connection
 * You will need to close the connection using db.close()
 * @returns a Database connection object
 */
const getDB = () => {
  return new Database('db.sqlite')
}

export { getDB }