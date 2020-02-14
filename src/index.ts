import { config } from 'dotenv'
config()

import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import Router from 'koa-router'
import helmet from 'koa-helmet'
import graphqlKoa from 'koa-graphql'
import cors from '@koa/cors'

// import schema from './graphql'
// import authorize from './middlewares/authorize'
import requestLogin from './middlewares/request-login'
import login from './middlewares/login'
// import login, { autologin } from './middlewares/login'

const app = new Koa()

app.use(helmet())
app.use(
  cors({
    origin: 'http://localhost:3000',
  })
)
app.use(
  bodyParser({
    enableTypes: ['json', 'form', 'text'],
    extendTypes: {
      text: ['text/xml'],
    },
  })
)

const router = new Router()

router.post('/request-login', requestLogin())
router.post('/login', login())
// if (process.env.NODE_ENV === 'production') {
//   router.post('/graphql', authorize(), graphqlKoa({ schema }))
// } else {
//   router.all(
//     '/graphql',
//     autologin(),
//     authorize(),
//     graphqlKoa({ schema, graphiql: true })
//   )
// }

app.use(router.routes()).use(router.allowedMethods())

app.listen(5000)
