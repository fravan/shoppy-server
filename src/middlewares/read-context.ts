import { Context } from 'koa'
import jwt from 'jsonwebtoken'

export function readUserId(context: Context) {
  const Authorization = context.request.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const { userId } = jwt.verify(token, process.env.SECURE_KEY!) as {
      userId: string
    }
    return userId
  }
  return null
}
