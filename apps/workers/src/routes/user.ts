import { Hono } from "hono";
import { r2 } from "@/lib/r2"
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { prismaClient } from "@repo/db/prismaClient"
import { AppVariables, AppBindings } from '../index';

const userRouter = new Hono<{ Bindings: AppBindings, Variables: AppVariables }>();

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
    const user_id = c.get('user_id');

    try{
        await prismaClient.user.update({
            where: { clerk_id: user_id },
            data: { resume_obj_key: key }
        });
        return c.json({ success: true }, 200);
    }catch(e){
        return c.json({ success: false, error: 'Server error: ' + e}, 500);
    }

})

userRouter.get("/resume", async (c) => {
    const user_id = c.get('user_id');

    const user = await prismaClient.user.findUnique({
        where: { clerk_id: user_id },
        select: { resume_obj_key: true }
    });
    if(!user?.resume_obj_key){
        return c.json({ error: "User has no resume" }, 404);
    }
    const key = user.resume_obj_key;

    const resume = await c.env.RESUME_BUCKET.get(key);
    if(!resume) return c.json({ error: "File missing in R2Bucket." }, 404);

    const filename = key.split("-")[1];

    return new Response(resume.body, {
        headers: {
            "ContentType": resume.httpMetadata?.contentType || "application/pdf",
            "Content-Disposition": `attachment, filename=${filename}`
        }
    })
})

export default userRouter;