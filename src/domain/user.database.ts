import bcrypt from 'bcryptjs'
import { getPool, sql } from './db-connection'
import { User, UserType } from './user.model'

function mapToUser(row: any): User {
  return {
    id: row.id,
    active: row.active,
    activatedAt: row.activated_at,
    activatedBy: row.activated_by,
    deactivatedAt: row.deactivated_at,
    deactivatedBy: row.deactivated_by,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    password: row.password,
    type: row.type,
  }
}

export function createUsersConnection() {
  const pool = getPool()

  return {
    dispose: async () => await pool.end(),
    getUsers: async () => {
      const res = await pool.many(sql`SELECT * FROM users WHERE active = TRUE;`)
      return res.map(mapToUser)
    },
    addUser: async (
      user: Pick<User, 'firstName' | 'lastName' | 'email' | 'password'>
    ) => {
      const cryptedPassword = await bcrypt.hash(user.password, 10)
      const res = await pool.one(sql`
      INSERT INTO users(first_name, last_name, email, password, type) 
      VALUES(${user.firstName}, ${user.lastName}, ${user.email}, ${cryptedPassword}, ${UserType.USER})
      RETURNING *
      `)
      return mapToUser(res)
    },
    getUserByEmail: async (email: string) => {
      const res = await pool.maybeOne(
        sql`SELECT * FROM users WHERE email = ${email}`
      )
      return res != null ? mapToUser(res) : null
    },
    getUserById: async (id: string) => {
      const res = await pool.maybeOne(sql`SELECT * FROM users WHERE id = ${id}`)
      return res != null ? mapToUser(res) : null
    },
    getPendingRegistrations: async () => {
      const res = await pool.many(sql`SELECT * FROM users WHERE active IS NULL`)
      return res.map(mapToUser)
    },
    validateRegistration: async (id: string, activatedById: string) => {
      const res = await pool.one(sql`
      UPDATE users SET active = TRUE, activated_at = NOW(), activated_by = ${activatedById}
      WHERE id = ${id} AND active IS NULL RETURNING *
      `)
      return mapToUser(res)
    },
    cancelRegistration: async (id: string, deactivatedById: string) => {
      const res = await pool.one(sql`
      UPDATE users SET active = FALSE, deactivated_at = NOW(), deactivated_by = ${deactivatedById}
      WHERE id = ${id} AND active IS NULL RETURNING *
      `)
      return mapToUser(res)
    },
  }
}
