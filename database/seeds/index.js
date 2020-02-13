const { config } = require('dotenv')
config()
const { createPool, sql } = require('slonik')
const { getConnectionString } = require('../shared')
const createUsers = require('./users')

async function start() {
  const pool = createPool(getConnectionString(process.env.PGDATABASE))

  try {
    await pool.connect(async connection => {
      console.log('Clearing database...')
      await connection.query(sql`DELETE FROM users`)
      await connection.query(sql`DELETE FROM items`)

      console.log('    database cleared !')

      const users = await createUsers(connection)
      console.log(users)
      // console.log('    Adding workshops...')
      // const workshops = await createWorkshops(client, users)
    })
    process.exitCode = 0
  } catch (err) {
    console.log('Error while seeding : ', err)
    process.exitCode = 1
  } finally {
    await pool.end()
  }
}

start()
