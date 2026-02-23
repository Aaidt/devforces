import { Hono } from "hono";
import { r2 } from "@/lib/r2"
import { Webhook } from "svix"
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { prismaClient } from "@repo/db/prismaClient"

const userRouter = new Hono();

userRouter.post("/resume/upload_url", async (c) => {
    const { filename, content_type } = await c.req.json();

    const key = `resume/${crypto.randomUUID()}-${filename}`;
    const command = new PutObjectCommand({
        Bucket: "resume",
        Key: key,
        ContentType: content_type
    });

    const url = await getSignedUrl(r2, command, { expiresIn: 60 });

    return c.json({ url, key });
})

userRouter.post("/resume/confirm", async (c) => {
    const { key } = await c.req.json();

})

userRouter.post("/webhook/clerk", async (c) => {
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

export default userRouter;