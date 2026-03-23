/*
  Warnings:

  - You are about to drop the column `admin_id` on the `Contest` table. All the data in the column will be lost.
  - You are about to drop the column `admin_id` on the `HiringPost` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Leaderboard` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[contest_id,candidate_id]` on the table `Leaderboard` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `question_type` to the `Challenge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recruiter_id` to the `HiringPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `candidate_id` to the `Leaderboard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `candidate_id` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('easy', 'medium', 'hard');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('mcq', 'dsa', 'project');

-- CreateEnum
CREATE TYPE "Project_type" AS ENUM ('backend', 'frontend');

-- DropForeignKey
ALTER TABLE "Contest" DROP CONSTRAINT "Contest_admin_id_fkey";

-- DropForeignKey
ALTER TABLE "HiringPost" DROP CONSTRAINT "HiringPost_admin_id_fkey";

-- DropForeignKey
ALTER TABLE "Leaderboard" DROP CONSTRAINT "Leaderboard_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_user_id_fkey";

-- DropIndex
DROP INDEX "HiringPost_admin_id_idx";

-- DropIndex
DROP INDEX "Leaderboard_contest_id_user_id_key";

-- DropIndex
DROP INDEX "Submission_user_id_idx";

-- AlterTable
ALTER TABLE "Challenge" ADD COLUMN     "difficulty" "Difficulty" NOT NULL DEFAULT 'medium',
ADD COLUMN     "question_type" "QuestionType" NOT NULL;

-- AlterTable
ALTER TABLE "Contest" DROP COLUMN "admin_id";

-- AlterTable
ALTER TABLE "HiringPost" DROP COLUMN "admin_id",
ADD COLUMN     "recruiter_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Leaderboard" DROP COLUMN "user_id",
ADD COLUMN     "candidate_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "user_id",
ADD COLUMN     "candidate_id" TEXT NOT NULL,
ADD COLUMN     "selected_option" INTEGER,
ALTER COLUMN "submission" DROP NOT NULL,
ALTER COLUMN "points" DROP NOT NULL,
ALTER COLUMN "language" DROP NOT NULL;

-- DropTable
DROP TABLE "User";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "Candidate" (
    "clerk_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "email_verified" BOOLEAN,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone" TEXT,
    "profile_pic_key" TEXT,
    "bio" TEXT,
    "resume_obj_key" TEXT,
    "gh_url" TEXT,
    "lc_url" TEXT,
    "cf_url" TEXT,
    "wakatime_api" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("clerk_id")
);

-- CreateTable
CREATE TABLE "Recruiter" (
    "clerk_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "email_verified" BOOLEAN,
    "company_name" TEXT,
    "company_description" TEXT,
    "company_website" TEXT,
    "company_employees" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recruiter_pkey" PRIMARY KEY ("clerk_id")
);

-- CreateTable
CREATE TABLE "MCQChallenge" (
    "id" TEXT NOT NULL,
    "challenge_id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "correct_idx" INTEGER NOT NULL,

    CONSTRAINT "MCQChallenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DSAChallenge" (
    "id" TEXT NOT NULL,
    "challenge_id" TEXT NOT NULL,
    "input_format" TEXT NOT NULL,
    "output_format" TEXT NOT NULL,
    "constraints" TEXT NOT NULL,
    "test_cases" JSONB NOT NULL,
    "hidden_cases" JSONB NOT NULL,

    CONSTRAINT "DSAChallenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectChallenge" (
    "id" TEXT NOT NULL,
    "project_type" "Project_type" NOT NULL,
    "repo_template_url" TEXT,
    "requirements" TEXT NOT NULL,
    "evaluation_criteria" TEXT NOT NULL,
    "test_config" JSONB,
    "challenge_id" TEXT NOT NULL,

    CONSTRAINT "ProjectChallenge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_email_key" ON "Candidate"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Recruiter_email_key" ON "Recruiter"("email");

-- CreateIndex
CREATE UNIQUE INDEX "MCQChallenge_challenge_id_key" ON "MCQChallenge"("challenge_id");

-- CreateIndex
CREATE UNIQUE INDEX "DSAChallenge_challenge_id_key" ON "DSAChallenge"("challenge_id");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectChallenge_challenge_id_key" ON "ProjectChallenge"("challenge_id");

-- CreateIndex
CREATE INDEX "HiringPost_recruiter_id_idx" ON "HiringPost"("recruiter_id");

-- CreateIndex
CREATE UNIQUE INDEX "Leaderboard_contest_id_candidate_id_key" ON "Leaderboard"("contest_id", "candidate_id");

-- CreateIndex
CREATE INDEX "Submission_candidate_id_idx" ON "Submission"("candidate_id");

-- AddForeignKey
ALTER TABLE "HiringPost" ADD CONSTRAINT "HiringPost_recruiter_id_fkey" FOREIGN KEY ("recruiter_id") REFERENCES "Recruiter"("clerk_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MCQChallenge" ADD CONSTRAINT "MCQChallenge_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "Challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DSAChallenge" ADD CONSTRAINT "DSAChallenge_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "Challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectChallenge" ADD CONSTRAINT "ProjectChallenge_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "Challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "Candidate"("clerk_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leaderboard" ADD CONSTRAINT "Leaderboard_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "Candidate"("clerk_id") ON DELETE RESTRICT ON UPDATE CASCADE;
