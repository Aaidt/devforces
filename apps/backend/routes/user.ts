import { Router } from "express";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from "@/lib/r2";
import { prismaClient } from "@repo/db/prismaClient";

const userRouter = Router();

userRouter.post("/resume/upload_url", async (req, res) => {
    try {
        const { filename, content_type } = req.body;
        const key = `resume/${Math.random().toString(36).substring(2, 15)}-${filename}`;
        const command = new PutObjectCommand({
            Bucket: "resume",
            Key: key,
            ContentType: content_type
        });
        const url = await getSignedUrl(r2, command, { expiresIn: 60 });
        res.json({ url, key });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error: " + error });
    }
});

userRouter.post("/resume/confirm", async (req, res) => {
    try{
        const { key } = req.body;
        const user_id = req.user_id;
        await prismaClient.user.update({
            where: { clerk_id: user_id },
            data: { resume_obj_key: key }
        });
        res.status(200).json({ success: true });
    }catch(error){
        console.error(error);
        res.status(500).json({ error: "Server error: " + error });
    }
});

userRouter.get("/resume", async (req, res) => {
    const user_id = req.user_id;
    const user = await prismaClient.user.findUnique({
        where: { clerk_id: user_id },
        select: { resume_obj_key: true }
    });
    if(!user?.resume_obj_key){
        res.status(404).json({ error: "User has no resume" });
    }
    const key = user.resume_obj_key;
    const resume = await r2.send(new GetObjectCommand({
        Bucket: "resume",
        Key: key
    }));
    if(!resume) {
        res.status(404).json({ error: "File missing in R2Bucket." });
        return;
    }
    const filename = key.split("-")[1];
    res.status(200).json({ resume: resume.Body, filename: filename });
});

export default userRouter;