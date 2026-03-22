import { Router } from "express";
import { GetObjectCommand, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from "@/lib/r2";
import { prismaClient } from "@repo/db/prismaClient";
import { get_redisClient } from "@repo/redisClient/redis-client"
import { userDetailsSchema, profilePicSchema, resumeSchema } from "types"

const userRouter = Router();
const redis = get_redisClient();

const BUCKET_NAME = process.env.BUCKET_NAME as string;

userRouter.post("/profile_pic/url", async (req, res) => {
   const result = profilePicSchema.safeParse(req.body);
   if (!result.success) {
      console.log("Invalid profile pic details");
      res.status(400).json({ message: "Invalid profile pic details" });
      return;
   }

   const { pic_name, pic_type } = result.data;
   const user_id = req.user_id;

   const key = `profile_pics/${crypto.randomUUID()}-${pic_name}`;

   await redis.set(`pending:user:${user_id}:profile_pic`, key, 'EX', 300);
   console.log("pending:user:profile_pic set in redis");

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
      console.log("Server error: Failed to get presigned url for profile_pic upload, err: " + err);
      res.status(500).json({ message: "Server error: Failed to get presigned url for profile_pic upload, err: " + err })
   }
})

userRouter.post("/details/confirm", async (req, res) => {
   const result = userDetailsSchema.safeParse(req.body);
   if (!result.success) {
      console.log("Invalid user details");
      res.status(400).json({ message: "Invalid user details" });
      return;
   }

   const { firstName, lastName, phone, email, bio, ghUrl, lcUrl, cfUrl } = result.data;
   const user_id = req.user_id;

   const key = await redis.get(`pending:user:${user_id}:profile_pic`);
   console.log("pending:user:profile_pic found in redis");
   if (!key) {
      console.log("No key found for profile_pic obj of user: " + user_id);
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

      await prismaClient.user.update({
         where: { clerk_id: req.user_id },
         data: {
            profile_pic_key: key,
            first_name: firstName,
            last_name: lastName,
            phone: phone,
            email: email,
            bio: bio,
            gh_url: ghUrl,
            lc_url: lcUrl,
            cf_url: cfUrl
         }
      });
      console.log("user updated in the db");

      await redis.del(`pending:user:${user_id}:profile_pic`);
      console.log("pending:user deleted from redis");

      res.status(200).json({ message: "Candidates details updated succesfuly", success: true })
   } catch (err) {
      console.log("Server error while updating users profile_pic_key: ", err);
      res.status(500).json({ message: "Server error: Failed to update users profile_pic_key: ", err })
   }
})

userRouter.post("/resume/upload_url", async (req, res) => {
   const result = resumeSchema.safeParse(req.body);
   if (!result.success) {
      console.log("Invalid resume details");
      res.status(400).json({ message: "Invalid resume details" });
      return;
   }

   const { filename, fileType } = result.data;
   const user_id = req.user_id;
   console.log("filename, fileType: ", filename, fileType);

   const key = `resumes/${req.user_id}-${crypto.randomUUID()}-${filename}`

   await redis.set(`pending:user:${user_id}:resume`, key, 'EX', 300);
   console.log("pending:user:resume set in redis");

   try {
      const command = new PutObjectCommand({
         Bucket: BUCKET_NAME,
         Key: key,
         ContentType: fileType || "application/pdf",
         ACL: "public-read"
      })
      console.log(command);

      // @ts-ignore
      const url = await getSignedUrl(r2, command, { expiresIn: 180 })
      // console.log(url);
      res.status(200).json({ url })
   } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error: Failed to get presigned url for resume upload, err: " + err })
   }
});

userRouter.post("/resume/confirm", async (req, res) => {
   const user_id = req.user_id

   const key = await redis.get(`pending:user:${user_id}:resume`);
   console.log("pending:user:resume found in redis");
   if (!key) {
      console.log("No resume key found for user: " + user_id);
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
      res.status(500).json({ message: "Server error: Failed to confirm resume upload, err: " + err })
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
         console.log("No resume key found for user: " + user_id);
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
      res.status(500).json({ message: "Server error: Failed to get resume, err: " + err })
   }
});

userRouter.get("/me", async (req, res) => {
   const user_id = req.user_id;

   try {
      let userStr = await redis.get(`user:${user_id}`);
      console.log("got from userStr ", userStr);
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
         res.status(404).json({ message: "User not found" });
         return;
      }

      let profilePicUrl = null;
      if (user.profile_pic_key) {
         const command = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: user.profile_pic_key
         });

         profilePicUrl = await getSignedUrl(r2, command, { expiresIn: 3600 });
      }

      res.status(200).json({
         first_name: user.first_name,
         profile_pic_url: profilePicUrl,
         user
      });
   } catch (err) {
      console.log("Error while fetching from /me endpoint: ", err);
      res.status(500).json({ message: "Server error fetching user" });
   }
});

// DELETE /me - Delete user and all related data
userRouter.delete("/me", async (req, res) => {
   const user_id = req.user_id;

   // try {
   //    // Delete in order of dependencies
   //    // 1. Delete submissions by the user
   //    await prismaClient.submission.deleteMany({
   //       where: { user_id }
   //    });

   //    // 2. Delete leaderboard entries
   //    await prismaClient.leaderboard.deleteMany({
   //       where: { user_id }
   //    });

   //    // 3. Delete hiring posts by the user (admin)
   //    await prismaClient.hiringPost.deleteMany({
   //       where: { admin_id: user_id }
   //    });

   //    // 4. For contests created by this user, clean up mappings first
   //    const userContests = await prismaClient.contest.findMany({
   //       where: { admin_id: user_id },
   //       select: { id: true }
   //    });
   //    const contestIds = userContests.map(c => c.id);

   //    if (contestIds.length > 0) {
   //       // Delete submissions tied to those contest mappings
   //       await prismaClient.submission.deleteMany({
   //          where: {
   //             contest_to_challenge_mapping: {
   //                contest_id: { in: contestIds }
   //             }
   //          }
   //       });

   //       // Delete leaderboard entries for those contests
   //       await prismaClient.leaderboard.deleteMany({
   //          where: { contest_id: { in: contestIds } }
   //       });

   //       // Delete contest-to-challenge mappings
   //       await prismaClient.contest_to_Challenge_mapping.deleteMany({
   //          where: { contest_id: { in: contestIds } }
   //       });

   //       // Delete the contests
   //       await prismaClient.contest.deleteMany({
   //          where: { admin_id: user_id }
   //       });
   //    }

   // 5. Delete the user record
   try {
      await prismaClient.user.delete({
         where: { clerk_id: user_id }
      });

      // 6. Clear Redis cache
      await redis.del(`user:${user_id}`);

      res.status(200).json({ message: "Account and all associated data deleted successfully." });
   } catch (err) {
      console.error("Error deleting user data:", err);
      res.status(500).json({ message: "Failed to delete account. Please try again." });
   }
});

export default userRouter;