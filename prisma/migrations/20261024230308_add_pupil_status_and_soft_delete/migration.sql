-- CreateEnum
CREATE TYPE "pupil_status" AS ENUM ('active', 'suspended');

-- AlterTable
ALTER TABLE "pupils" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "status" "pupil_status" NOT NULL DEFAULT 'active',
ADD COLUMN     "suspension_reason" TEXT;
