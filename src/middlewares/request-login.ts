import { Context } from 'koa'
import { writeError } from './errors'
import { createUsersConnection } from '../domain'

function requestLogin() {
  return async function useRequestLogin(
    ctx: Context,
    next: () => Promise<any>
  ) {
    console.log(ctx.request.body)
    const { email, firstName, lastName, password } = ctx.request.body
    if (
      email == null ||
      firstName == null ||
      lastName == null ||
      password == null
    ) {
      writeError(
        ctx,
        "Il manque des informations pour terminer votre demande d'inscription"
      )
      return
    }
    const userQueries = createUsersConnection()
    try {
      const user = await userQueries.getUserByEmail(email)
      if (user != null) {
        writeError(ctx, 'Cet email est déjà utilisé')
        return
      }
      const createdUser = await userQueries.addUser({
        email,
        firstName,
        lastName,
        password,
      })
      ctx.body = {
        message: "Votre demande d'inscription a bien été prise en compte",
        id: createdUser.id,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        email: createdUser.email,
      }
    } finally {
      await userQueries.dispose()
    }
    await next()
  }
}

export default requestLogin
