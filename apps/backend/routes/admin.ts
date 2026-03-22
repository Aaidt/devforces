import { Router } from "express";
import { PutObjectCommand, HeadObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from "@/lib/r2";
import { prismaClient } from "@repo/db/prismaClient";
import { get_redisClient } from "@repo/redisClient/redis-client";
import { profilePicSchema, companyDetailsSchema, hiringPostSchema } from "../types";
import { userMiddleware } from "../middleware/user";
import { adminMiddleware } from "../middleware/admin";

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

adminRouter.post("/hiring/post", adminMiddleware, async (req, res) => {
   const result = hiringPostSchema.safeParse(req.body);
   if (!result.success) {
      res.status(400).json({ message: "Invalid hiring post details" });
      return;
   }

   const { jobTitle, jobDescription, requirements, contestTitle, deadline, startTime } = result.data;
   const user_id = req.user_id;

   try {
      const result = await prismaClient.$transaction(async (tx) => {
         const contest = await tx.contest.create({
            data: {
               title: contestTitle,
               deadline: new Date(deadline),
               start_time: new Date(startTime),
               admin_id: user_id
            }
         });

         const hiringPost = await tx.hiringPost.create({
            data: {
               job_title: jobTitle,
               job_description: jobDescription,
               requirements: requirements,
               admin_id: user_id,
               contest_id: contest.id
            }
         });

         return { contest, hiringPost };
      });

      res.status(200).json({
         message: "Hiring post created and contest launched!",
         success: true,
         contestId: result.contest.id,
         hiringPostId: result.hiringPost.id
      });
   } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error: Failed to create hiring post" });
   }
});

adminRouter.get("/hiring/posts", adminMiddleware, async (req, res) => {
   const user_id = req.user_id;
   try {
      const posts = await prismaClient.hiringPost.findMany({
         where: { admin_id: user_id },
         include: { contest: true },
         orderBy: { created_at: "desc" }
      });
      res.status(200).json({ posts });
   } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error: Failed to fetch hiring posts" });
   }
});

adminRouter.get("/me", adminMiddleware, async (req, res) => {
   const user_id = req.user_id;

   try {
      let userStr = await redis.get(`user:${user_id}`);
      let user;

      if (userStr) {
         user = JSON.parse(userStr);
      } else {
         user = await prismaClient.user.findUnique({
            where: { clerk_id: user_id }
         });
         if (user) {
            await redis.set(`user:${user_id}`, JSON.stringify(user), 'EX', 3600);
         }
      }

      if (!user) {
         res.status(404).json({ message: "Admin not found" });
         return;
      }

      let profilePicUrl = null;
      if (user.profile_pic_key) {
         const command = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: user.profile_pic_key
         });
         // @ts-ignore
         profilePicUrl = await getSignedUrl(r2, command, { expiresIn: 3600 });
      }

      res.status(200).json({
         first_name: user.first_name || user.company_name || "Admin",
         profile_pic_url: profilePicUrl,
         user
      });
   } catch (err) {
      console.log("Error while fetching from admin /me endpoint: ", err);
      res.status(500).json({ message: "Server error fetching admin" });
   }
});

export default adminRouter;