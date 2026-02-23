import { Hono } from 'hono'
import { cors } from 'hono/cors'
import userRouter from "./routes/user"

const app = new Hono()

app.use('/*', cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  allowMethods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 600,
  exposeHeaders: ['X-Custom']
}))


app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route("/v1/user", userRouter)

export default app
