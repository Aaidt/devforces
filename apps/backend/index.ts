import express from "express";
import userRouter from "./routes/user";
import adminRouter from "./routes/admin";
import cors from "cors";
import { Webhook } from "svix";
import { prismaClient } from "@repo/db/prismaClient";
import { userMiddleware } from "./middleware/user";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/v1/admin", adminRouter);
app.use("/v1/user", userMiddleware, userRouter);

app.post("/webhook/clerk", async (req, res) => {
    const payload = req.body;
    const svixId = req.headers['svix-id'];
    const svixTimestamp = req.headers['svix-timestamp'];
    const svixSignature = req.headers['svix-signature'];

    if (!svixId || !svixTimestamp || !svixSignature) {
        res.status(400).json({ error: 'Missing headers' });
        return;
    }

    try {
        const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
        const evt = wh.verify(payload, {
            'svix-id': svixId as string,
            'svix-timestamp': svixTimestamp as unknown as string,
            'svix-signature': svixSignature as string,
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
                    profile_pic_key: image_url || null,
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
        } else if (evt.type === 'user.deleted') {
            const { id } = evt.data;
            await prismaClient.user.delete({ where: { clerk_id: id } })
        } else if (evt.type === 'user.updated') {
            //TODO: update the required fields 
        }

        res.status(200).json({ success: true });
    } catch (err) {
        console.error('Webhook error:', err);
        res.status(400).json({ error: 'Verification failed' });
    }
})

app.listen(3000, () => { console.log("Server is running on port 3000") });