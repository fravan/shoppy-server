function getConnectionString(database) {
  return `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${database}`
}

module.exports = { getConnectionString }
