import fs from 'fs'

import { Database } from 'sqlite3'

// Open a SQLite database, stored in the file db.sqlite
const db = new Database('db.sqlite')

// Read and execute the SQL query in ./sql/articles.sql
db.exec(fs.readFileSync(__dirname + '/seed.sql').toString(), (err) => {
  if (err) {
    console.error(err)
  }
  console.log('Database seeded')
})
