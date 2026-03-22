import { Router } from "express";
import { PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from "@/lib/r2";
import { prismaClient } from "@repo/db/prismaClient";
import { get_redisClient } from "@repo/redisClient/redis-client";
import { profilePicSchema, companyDetailsSchema } from "../types";
import { userMiddleware } from "../middleware/user";

const adminRouter = Router();
const redis = get_redisClient();
const BUCKET_NAME = process.env.BUCKET_NAME as string;

adminRouter.post("/hiring/profile_pic/url", userMiddleware, async (req, res) => {
   const result = profilePicSchema.safeParse(req.body);
   if (!result.success) {
      res.status(400).json({ message: "Invalid profile pic details" });
      return;
   }

   const { pic_name, pic_type } = result.data;
   const user_id = req.user_id;

   const key = `company_pics/${crypto.randomUUID()}-${pic_name}`;

   await redis.set(`pending:company:${user_id}:profile_pic`, key, 'EX', 300);

   try {
      const command = new PutObjectCommand({
         Bucket: BUCKET_NAME,
         Key: key,
         ContentType: pic_type || "image/png"
      });

      // @ts-ignore
      const url = await getSignedUrl(r2, command, { expiresIn: 180 });
      res.status(200).json({ url })
   } catch (err) {
      res.status(500).json({ message: "Server error: Failed to get presigned url" })
   }
});

adminRouter.post("/hiring/details/confirm", userMiddleware, async (req, res) => {
   const result = companyDetailsSchema.safeParse(req.body);
   if (!result.success) {
      res.status(400).json({ message: "Invalid details" });
      return;
   }

   const { companyName, companyDescription, companyWebsite, companyEmployees } = result.data;
   const user_id = req.user_id;

   const key = await redis.get(`pending:company:${user_id}:profile_pic`);
   if (!key) {
      res.status(404).json({ message: "No profile pic found. Upload the image first." });
      return;
   }

   try {
      await r2.send(new HeadObjectCommand({ Bucket: BUCKET_NAME, Key: key }));

      await prismaClient.user.update({
         where: { clerk_id: user_id },
         data: {
            profile_pic_key: key,
            company_name: companyName,
            company_description: companyDescription,
            company_website: companyWebsite,
            company_employees: companyEmployees,
            role: "admin"
         }
      });

      await redis.del(`pending:company:${user_id}:profile_pic`);

      res.status(200).json({ message: "Company details updated successfully", success: true })
   } catch (err) {
      console.log(err)
      res.status(500).json({ message: "Server error: Failed to update company details" })
   }
});

adminRouter.get("/", (req, res) => {
  res.send("Admin Router Ready");
});

export default adminRouter;