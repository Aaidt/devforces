-- CreateEnum
CREATE TYPE "Role" AS ENUM ('User', 'Admin');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contest" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContestToChallengeMapping" (
    "id" TEXT NOT NULL,
    "contestId" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "index" INTEGER NOT NULL,

    CONSTRAINT "ContestToChallengeMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Challege" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "notionDocId" TEXT NOT NULL,
    "maxPoints" INTEGER NOT NULL,

    CONSTRAINT "Challege_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "submission" TEXT NOT NULL,
    "contestId" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contestToChallengeMappingId" TEXT NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Leaderboard" (
    "id" TEXT NOT NULL,
    "contestId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,

    CONSTRAINT "Leaderboard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ContestToChallengeMapping_contestId_challengeId_key" ON "ContestToChallengeMapping"("contestId", "challengeId");

-- CreateIndex
CREATE UNIQUE INDEX "Leaderboard_contestId_userId_key" ON "Leaderboard"("contestId", "userId");

-- AddForeignKey
ALTER TABLE "ContestToChallengeMapping" ADD CONSTRAINT "ContestToChallengeMapping_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestToChallengeMapping" ADD CONSTRAINT "ContestToChallengeMapping_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challege"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_contestToChallengeMappingId_fkey" FOREIGN KEY ("contestToChallengeMappingId") REFERENCES "ContestToChallengeMapping"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leaderboard" ADD CONSTRAINT "Leaderboard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leaderboard" ADD CONSTRAINT "Leaderboard_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
