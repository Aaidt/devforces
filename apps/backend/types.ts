import { z } from "zod";

export const userDetailsSchema = z.object({
   firstName: z.string().min(3, "First name is required"),
   lastName: z.string().min(3, "Last name is required"),
   phone: z.string().min(10, "Phone number is required"),
   email: z.string().includes("@").email("Invalid email address"),
   bio: z.string().min(1, "Bio is required"),
   ghUrl: z.string().includes("https://github.com/", { position: 0 }),
   lcUrl: z.string().includes("https://leetcode.com/", { position: 0 }).optional(),
   cfUrl: z.string().includes("https://codeforces.com/", { position: 0 }).optional(),
});

export const profilePicSchema = z.object({
   pic_name: z.string().min(1, "Pic name is required"),
   pic_type: z.string().min(1, "Pic type is required"),
});

export const resumeSchema = z.object({
   filename: z.string().min(1, "Filename is required"),
   fileType: z.string().min(1, "File type is required"),
});