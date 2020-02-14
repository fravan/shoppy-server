import { Context } from 'koa'

export function writeError(ctx: Context, errorMessage: string) {
  ctx.status = 400
  ctx.body = { error: errorMessage }
}
