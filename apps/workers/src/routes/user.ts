import { Hono } from "hono";
import { r2 } from "@/lib/r2"
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { prismaClient } from "@/prismaClient"

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

export default userRouter;