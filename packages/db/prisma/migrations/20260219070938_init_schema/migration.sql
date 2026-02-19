/*
  Warnings:

  - The values [User,Admin] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `startTime` on the `Contest` table. All the data in the column will be lost.
  - You are about to drop the column `contestId` on the `Leaderboard` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Leaderboard` table. All the data in the column will be lost.
  - You are about to drop the column `challengeId` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `contestId` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `contestToChallengeMappingId` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Challege` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContestToChallengeMapping` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[title]` on the table `Contest` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[contest_id,user_id]` on the table `Leaderboard` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[contest_id,rank]` on the table `Leaderboard` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `deadline` to the `Contest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `Contest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contest_id` to the `Leaderboard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Leaderboard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contest_to_challenge_mapping_id` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gh_url` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile_pic` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Language" AS ENUM ('javascript', 'typescript', 'python', 'java', 'go', 'csharp', 'php');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('pending', 'running', 'failed', 'accepted');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('user', 'admin');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "ContestToChallengeMapping" DROP CONSTRAINT "ContestToChallengeMapping_challengeId_fkey";

-- DropForeignKey
ALTER TABLE "ContestToChallengeMapping" DROP CONSTRAINT "ContestToChallengeMapping_contestId_fkey";

-- DropForeignKey
ALTER TABLE "Leaderboard" DROP CONSTRAINT "Leaderboard_contestId_fkey";

-- DropForeignKey
ALTER TABLE "Leaderboard" DROP CONSTRAINT "Leaderboard_userId_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_contestToChallengeMappingId_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_userId_fkey";

-- DropIndex
DROP INDEX "Leaderboard_contestId_userId_key";

-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "Contest" DROP COLUMN "startTime",
ADD COLUMN     "deadline" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "start_time" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Leaderboard" DROP COLUMN "contestId",
DROP COLUMN "userId",
ADD COLUMN     "contest_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "challengeId",
DROP COLUMN "contestId",
DROP COLUMN "contestToChallengeMappingId",
DROP COLUMN "createdAt",
DROP COLUMN "userId",
ADD COLUMN     "contest_to_challenge_mapping_id" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "feedback" TEXT,
ADD COLUMN     "language" "Language" NOT NULL,
ADD COLUMN     "status" "Status" NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "email",
DROP COLUMN "password",
DROP COLUMN "updatedAt",
ADD COLUMN     "cf_url" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "gh_url" TEXT NOT NULL,
ADD COLUMN     "lc_url" TEXT,
ADD COLUMN     "profile_pic" TEXT NOT NULL,
ADD COLUMN     "resume_url" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "Challege";

-- DropTable
DROP TABLE "ContestToChallengeMapping";

-- CreateTable
CREATE TABLE "Contest_to_Challenge_mapping" (
    "id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "contest_id" TEXT NOT NULL,
    "challenge_id" TEXT NOT NULL,

    CONSTRAINT "Contest_to_Challenge_mapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Challenge" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "max_pts" INTEGER NOT NULL,
    "challenge_doc" TEXT NOT NULL,

    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Contest_to_Challenge_mapping_contest_id_challenge_id_key" ON "Contest_to_Challenge_mapping"("contest_id", "challenge_id");

-- CreateIndex
CREATE UNIQUE INDEX "Contest_to_Challenge_mapping_contest_id_position_key" ON "Contest_to_Challenge_mapping"("contest_id", "position");

-- CreateIndex
CREATE UNIQUE INDEX "Challenge_title_key" ON "Challenge"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Contest_title_key" ON "Contest"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Leaderboard_contest_id_user_id_key" ON "Leaderboard"("contest_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Leaderboard_contest_id_rank_key" ON "Leaderboard"("contest_id", "rank");

-- CreateIndex
CREATE INDEX "Submission_user_id_idx" ON "Submission"("user_id");

-- CreateIndex
CREATE INDEX "Submission_contest_to_challenge_mapping_id_idx" ON "Submission"("contest_to_challenge_mapping_id");

-- AddForeignKey
ALTER TABLE "Contest_to_Challenge_mapping" ADD CONSTRAINT "Contest_to_Challenge_mapping_contest_id_fkey" FOREIGN KEY ("contest_id") REFERENCES "Contest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contest_to_Challenge_mapping" ADD CONSTRAINT "Contest_to_Challenge_mapping_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "Challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_contest_to_challenge_mapping_id_fkey" FOREIGN KEY ("contest_to_challenge_mapping_id") REFERENCES "Contest_to_Challenge_mapping"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leaderboard" ADD CONSTRAINT "Leaderboard_contest_id_fkey" FOREIGN KEY ("contest_id") REFERENCES "Contest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leaderboard" ADD CONSTRAINT "Leaderboard_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
