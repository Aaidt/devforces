import { response, Router } from "express";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from "@/lib/r2";
import { prismaClient } from "@repo/db/prismaClient";

const userRouter = Router();

const BUCKET_NAME = process.env.BUCKET_NAME as string;

userRouter.post("/candidate-details", async (req, res) => {
    const { firstName, lastName, email, phone, pic, ghUrl, lcUrl, cfUrl } = req.body;
    const user_id = req.user_id;

    try{
        const response = await prismaClient.user.update({
            where: { clerk_id: user_id},
            data: {
                first_name: firstName,
                last_name: lastName,
                phone: phone,
                email: email,
                profile_pic: pic,
                gh_url: ghUrl,
                lc_url: lcUrl,
                cf_url: cfUrl
            }
        })
        res.status(200).json({ message: `${response.clerk_id} updated successfully` })            
    }catch(err){
        console.log("err: " + err);
        res.status(500).json({ message: "Server error: " + err })
    }
})

userRouter.post("/resume/upload_url", async (req, res) => {
    const { filename, content_type } = req.body;
    const key = `resumes/${req.user_id}-${Date.now()}-${filename}`

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
    const { key } = req.body;
    const user_id = req.user_id
    try {
        await prismaClient.user.update({
            where: { clerk_id: user_id },
            data: { resume_obj_key: key }
        });
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