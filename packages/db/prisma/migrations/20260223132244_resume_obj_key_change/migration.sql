/*
  Warnings:

  - You are about to drop the column `resume_url` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "resume_url",
ADD COLUMN     "resume_obj_key" TEXT;
