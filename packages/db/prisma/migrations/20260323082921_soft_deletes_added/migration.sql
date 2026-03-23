-- AlterTable
ALTER TABLE "Candidate" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Recruiter" ADD COLUMN     "deleted_at" TIMESTAMP(3);
