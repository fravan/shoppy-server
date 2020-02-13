const fs = require('fs')
const util = require('util')
const path = require('path')
const { createPool, sql } = require('slonik')
const { raw } = require('slonik-sql-tag-raw')
const { config } = require('dotenv')
const { getConnectionString } = require('../shared')
config()

const readdir = util.promisify(fs.readdir)
const readFile = util.promisify(fs.readFile)

async function executeScript(file, pool) {
  const filePath = path.join(__dirname, file)
  const data = await readFile(filePath, { encoding: 'utf8' })
  console.log(`Applying migration : ${file}...`)
  const res = await pool.query(sql`${raw(data)}`)
  console.log(`    migration applied !`)
  return res
}

async function start() {
  let pool
  const dev = process.argv.some(a => a === 'dev')
  if (dev) {
    // Drop everything, recreate table from scratch
    console.log('Recreating whole database')
    const adminPool = createPool(getConnectionString('postgres'))
    try {
      await adminPool.query(
        sql`DROP DATABASE IF EXISTS ${sql.identifier([process.env.PGDATABASE])}`
      )
      await adminPool.query(
        sql`CREATE DATABASE ${sql.identifier([process.env.PGDATABASE])}`
      )
    } catch (err) {
      console.log('Error while dropping database : ', err)
      process.exitCode = 0
      return
    } finally {
      await adminPool.end()
    }
  }

  pool = createPool(getConnectionString(process.env.PGDATABASE))
  await pool.connect(async connection => {
    const files = await readdir(__dirname)
    const scripts = files.filter(f => f.endsWith('.sql')).sort()
    try {
      if (scripts.length > 0) {
        for (let i = 0; i < scripts.length; i++) {
          await executeScript(scripts[i], connection)
        }
        console.log('Successfully migrated to latest version')
        process.exitCode = 0
      } else {
        console.log('Noting to migrate')
        process.exitCode = 0
      }
    } catch (err) {
      console.log('Error while migrating : ', err)
      process.exitCode = 1
    }
  })
  await pool.end()
}

start()
