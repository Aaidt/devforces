import { Router } from "express";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from "@/lib/r2";
import { prismaClient } from "@repo/db/prismaClient";

const userRouter = Router();

let user_keys: Map<string, Map<"resume" | "profile_pic", string>> = new Map();

const BUCKET_NAME = process.env.BUCKET_NAME as string;

userRouter.post("/candidate-details", async (req, res) => {
    const { firstName, lastName, email, phone, pic_name, pic_type, ghUrl, lcUrl, cfUrl } = req.body;
    const user_id = req.user_id;

    const key = `profile_pics/${crypto.randomUUID()}-${pic_name}`;
    let user_map = user_keys.get(user_id);
    if (!user_map) {
        user_map = new Map();
        user_keys.set(user_id, user_map);
    }
    user_map.set("profile_pic", key);

    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        ContentType: pic_type
    });

    const url = await getSignedUrl(r2, command, { expiresIn: 60 });

    try {
        const response = await prismaClient.user.update({
            where: { clerk_id: user_id },
            data: {
                first_name: firstName,
                last_name: lastName,
                phone: phone,
                email: email,
                gh_url: ghUrl,
                lc_url: lcUrl,
                cf_url: cfUrl
            }
        })
        res.status(200).json({ message: `${response.clerk_id} updated successfully`, url, key })
    } catch (err) {
        console.log("err: " + err);
        res.status(500).json({ message: "Server error while updating users details: " + err })
    }
})

userRouter.post("/pic/confirm", async (req, res) => {
    // const { key } = req.body;
    const user_id = req.user_id;

    const user_map = user_keys.get(user_id);
    if (!user_map?.has("profile_pic")) {
        throw new Error(`No profile_pic keys found for ${user_id}`);
    }
    const key = user_map.get("profile_pic");

    try {
        await prismaClient.user.update({
            where: { clerk_id: req.user_id },
            data: {
                profile_pic_key: key
            }
        })

        user_map.delete("profile_pic");

        res.status(200).json({ message: "Users profile_pic_key updated succesfuly" })
    } catch (err) {
        console.log("Server error while updating users profile_pic_key: ", err);
        res.status(500).json({ message: "Server error while updating users profile_pic_key: ", err })
    }
})

userRouter.post("/resume/upload_url", async (req, res) => {
    const { filename, content_type } = req.body;
    const user_id = req.user_id;

    const key = `resumes/${req.user_id}-${crypto.randomUUID()}-${filename}`
    let user_map = user_keys.get(user_id);
    if (!user_map) {
        user_map = new Map();
        user_keys.set(user_id, user_map);
    }
    user_map.set("resume", key);

    try {
        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            ContentType: content_type
        })

        const url = await getSignedUrl(r2, command, { expiresIn: 60 })
        res.status(200).json({ url, key })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error: " + err })
    }
});

userRouter.post("/resume/confirm", async (req, res) => {
    // const { key } = req.body;
    const user_id = req.user_id

    const user_map = user_keys.get(user_id);
    if(!user_map?.has("resume")){
        throw new Error(`No profile_pic keys found for ${user_id}`);
    }
    const key = user_map?.get("resume")
    
    try {
        await prismaClient.user.update({
            where: { clerk_id: user_id },
            data: { resume_obj_key: key }
        });

        user_map.delete("resume");

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