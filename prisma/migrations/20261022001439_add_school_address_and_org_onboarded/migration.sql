-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "onboarded_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "schools" ADD COLUMN     "address" TEXT;
