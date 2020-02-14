import { createPool, sql, DatabasePoolType } from 'slonik'

export function getConnectionString(): string {
  return `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`
}

export function getPool() {
  return createPool(getConnectionString())
}

export async function usePool(cb: (pool: DatabasePoolType) => Promise<void>) {
  const pool = getPool()
  await cb(pool)
  await pool.end()
}

export { sql }
