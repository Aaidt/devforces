-- AlterTable
ALTER TABLE "Contest" ADD COLUMN     "admin_id" TEXT;

-- CreateTable
CREATE TABLE "HiringPost" (
    "id" TEXT NOT NULL,
    "job_title" TEXT NOT NULL,
    "job_description" TEXT NOT NULL,
    "requirements" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "admin_id" TEXT NOT NULL,
    "contest_id" TEXT,

    CONSTRAINT "HiringPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HiringPost_contest_id_key" ON "HiringPost"("contest_id");

-- CreateIndex
CREATE INDEX "HiringPost_admin_id_idx" ON "HiringPost"("admin_id");

-- AddForeignKey
ALTER TABLE "HiringPost" ADD CONSTRAINT "HiringPost_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "User"("clerk_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HiringPost" ADD CONSTRAINT "HiringPost_contest_id_fkey" FOREIGN KEY ("contest_id") REFERENCES "Contest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contest" ADD CONSTRAINT "Contest_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "User"("clerk_id") ON DELETE SET NULL ON UPDATE CASCADE;
