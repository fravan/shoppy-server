import { Context } from 'koa'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { createUsersConnection } from '../domain'
import { writeError } from './errors'

const ErrorMessage = 'Email ou mot de passe non valide'

function login() {
  return async function useLogin(ctx: Context, next: () => Promise<any>) {
    const { email, password } = ctx.request.body
    if (email == null || password == null) {
      writeError(ctx, ErrorMessage)
      return
    }
    const userQueries = createUsersConnection()
    try {
      const user = await userQueries.getUserByEmail(email)
      if (user == null) {
        writeError(ctx, ErrorMessage)
        return
      }
      const valid = await bcrypt.compare(password, user.password)
      if (!valid) {
        writeError(ctx, ErrorMessage)
        return
      }
      if (user.active !== true) {
        writeError(
          ctx,
          'Votre compte est momentanément désactivé. Merci de reéssayer plus tard.'
        )
        return
      }
      const token = jwt.sign({ userId: user.id }, process.env.SECURE_KEY!)
      ctx.body = { token }
    } finally {
      await userQueries.dispose()
    }
    await next()
  }
}

export function autologin() {
  return async function(ctx: Context, next: () => Promise<any>) {
    const userQueries = createUsersConnection()
    try {
      const user = await userQueries.getUserByEmail('franck@example.com')
      const token = jwt.sign({ userId: user!.id }, process.env.SECURE_KEY!)
      ctx.request.header = {
        ...ctx.request.header,
        authorization: `Bearer ${token}`,
      }
    } finally {
      userQueries.dispose()
    }
    await next()
  }
}

export default login
