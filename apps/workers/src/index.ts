import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { Webhook } from "svix"
import { prismaClient } from "@repo/db/prismaClient"
import { verifyToken } from "@clerk/backend"
import userRouter from "./routes/user"
import adminRouter from "./routes/admin"

export type AppVariables = { user_id: string }
export type AppBindings = { RESUME_BUCKET: R2Bucket }

const app = new Hono<{ Variables: AppVariables }>()

app.use('/*', cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  allowMethods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 600,
  exposeHeaders: ['X-Custom']
}))

app.post("/webhook/clerk", async (c) => {
  const payload = await c.req.text();
  const svixId = c.req.header('svix-id');
  const svixTimestamp = c.req.header('svix-timestamp');
  const svixSignature = c.req.header('svix-signature');

  if (!svixId || !svixTimestamp || !svixSignature) {
    return c.text('Missing headers', 400);
  }

  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
    const evt = wh.verify(payload, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as any;

    if (evt.type === 'user.created') {
      const {
        id,
        first_name,
        last_name,
        image_url,
        email_addresses,
        phone_numbers
      } = evt.data;
      
      const email = email_addresses?.[0]?.email_address;
      const email_verified = email_addresses?.[0]?.verification?.status === 'verified';
      
      await prismaClient.user.upsert({
        where: { clerk_id: id },
        update: {
          first_name: first_name,
          last_name: last_name,
          profile_pic: image_url || null,
          email,
          phone: phone_numbers?.[0]?.phone_number || null,
          email_verified
        },
        create: {
          clerk_id: id,
          email,
          first_name,
          last_name,
          email_verified,
          role: "user"
        }      
      });
    }else if(evt.type === 'user.deleted'){
      const { id } = evt.data;
      await prismaClient.user.delete({ where: { clerk_id: id } })
    }else if(evt.type === 'user.updated'){
      //TODO: update the required fields 
    }

    return c.json({ success: true }, 200);
  } catch (err) {
    console.error('Webhook error:', err);
    return c.text('Verification failed', 400);
  }
})

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
