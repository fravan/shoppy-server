import { Context } from 'koa'
import { readUserId } from './read-context'

function authorize() {
  return async function useAuthorize(ctx: Context, next: () => Promise<any>) {
    const userId = readUserId(ctx)
    if (userId == null) {
      ctx.throw(401, 'Vous devez être connecté avant de faire cette action')
    } else {
      ctx.state.userId = userId
      await next()
    }
  }
}

export default authorize
