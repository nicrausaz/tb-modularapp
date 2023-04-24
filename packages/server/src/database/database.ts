import fs from 'fs'

import { Database } from 'sqlite3'

// Open a SQLite database, stored in the file db.sqlite
const db = new Database('db.sqlite')

// Read and execute the SQL queries
db.exec(fs.readFileSync(__dirname + '/model.sql').toString(), (err) => {
  if (err) {
    console.error(err)
    return
  }
  console.log('Database seeded')
})
