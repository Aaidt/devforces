import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { verifyToken } from "@clerk/backend"
import userRouter from "./routes/user"
import adminRouter from "./routes/admin"

export interface Variables {
  user_id: string
}

const app = new Hono<{ Variables: Variables }>()

app.use('/*', cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  allowMethods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 600,
  exposeHeaders: ['X-Custom']
}))

app.use(async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 400);
  }

  const token = authHeader.split(" ")[1];
  try {
    const claims = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY,
       // authorizedParties: ['yourdomain.com'] 
     });
    c.set('user_id', claims.sub);
    // c.set('session_id', claims.ses);
    await next();
  } catch (e) {
    return c.json({ error: 'Invalid token' }, 400);
  }
})

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route("/v1/user", userRouter)
app.route("/v1/admin", adminRouter)

export default app
