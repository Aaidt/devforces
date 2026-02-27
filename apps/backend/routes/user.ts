import { Router } from "express";
import { GetObjectCommand, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from "@/lib/r2";
import { prismaClient } from "@repo/db/prismaClient";
import { get_redisClient } from "@repo/redisClient/redis-client"

const userRouter = Router();
const redis = get_redisClient();

const BUCKET_NAME = process.env.BUCKET_NAME as string;

userRouter.post("/profile_pic/url", async (req, res) => {
    const { pic_name, pic_type } = req.body;
    const user_id = req.user_id;

    const key = `profile_pics/${crypto.randomUUID()}-${pic_name}`;

    await redis
        .pipeline()
        .set(`pending:user:${user_id}:profile_pic`, key)
        .expire(`pending:user:${user_id}:profile_pic`, 300)
        .exec();

    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key
    });

    const url = await getSignedUrl(r2, command, { expiresIn: 180 });

    res.status(200).json({ url })
})

userRouter.post("/details/confirm", async (req, res) => {
    const { firstName, lastName, phone, email, ghUrl, lcUrl, cfUrl } = req.body;
    const user_id = req.user_id;

    const key = await redis.get(`pending:user:${user_id}:profile_pic`);
    if (!key) {
        res.status(404).json({ message: `No key found for profile_pic obj of user: ${user_id}` });
        return
    }

    try {
        await r2.send(
            new HeadObjectCommand({
                Bucket: BUCKET_NAME,
                Key: key
            })
        );
        console.log("profile_pic exists in r2")

        await prismaClient.$transaction(async (tx) => {
            await tx.user.update({
                where: { clerk_id: req.user_id },
                data: {
                    profile_pic_key: key,
                    first_name: firstName,
                    last_name: lastName,
                    phone: phone,
                    email: email,
                    gh_url: ghUrl,
                    lc_url: lcUrl,
                    cf_url: cfUrl
                }
            })
        })
        console.log("user updated in the db");

        await redis.del(`pending:user:${user_id}:profile_pic`);
        console.log("pending:user deleted from redis");

        res.status(200).json({ message: "Users profile_pic_key updated succesfuly", success: true })
    } catch (err) {
        console.log("Server error while updating users profile_pic_key: ", err);
        res.status(500).json({ message: "Server error while updating users profile_pic_key: ", err })
    }
})

userRouter.post("/resume/upload_url", async (req, res) => {
    const { filename } = req.body;
    const user_id = req.user_id;

    const key = `resumes/${req.user_id}-${crypto.randomUUID()}-${filename}`

    await redis
        .pipeline()
        .set(`pending:user:${user_id}:resume`, key)
        .expire(`pending:user:${user_id}:resume`, 300)
        .exec();

    try {
        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key
        })

        const url = await getSignedUrl(r2, command, { expiresIn: 180 })
        res.status(200).json({ url })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error: " + err })
    }
});

userRouter.post("/resume/confirm", async (req, res) => {
    const user_id = req.user_id

    const key = await redis.get(`pending:user:${user_id}:resume`);
    if (!key) {
        res.status(404).json({ message: `No resume key found for user: ${user_id}` });
        return;
    }

    try {
        await r2.send(
            new HeadObjectCommand({
                Bucket: BUCKET_NAME,
                Key: key
            })
        )
        console.log("Confirmed resume obj key exists in R2");

        await prismaClient.user.update({
            where: { clerk_id: user_id },
            data: { resume_obj_key: key }
        });
        console.log("user updated in the db");

        await redis.del(`pending:user:${user_id}:resume`);
        console.log("pending:user for resume deleted from redis");

        res.status(200).json({ success: true })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error: " + err })
    }
});

userRouter.get("/resume", async (req, res) => {
    const user_id = req.user_id;
    try {
        const user = await prismaClient.user.findUnique({
            where: { clerk_id: user_id },
            select: { resume_obj_key: true }
        });
        if (!user?.resume_obj_key) {
            res.status(404).json({ error: "User has no resume" });
            return;
        }
        const key = user.resume_obj_key;
        const command = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key
        });
        const response = await r2.send(command);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="resume.pdf"`,
            'Content-Length': response.ContentLength
        });
        (response.Body as any).pipe(res);
    } catch (err) {
        console.log("error: " + err);
        res.status(500).json({ message: "server error: " + err })
    }
});

export default userRouter;