-- DropIndex
DROP INDEX "staff_organization_id_email_key";

-- AlterTable
ALTER TABLE "staff" ADD COLUMN     "password_hash" TEXT,
ADD COLUMN     "invite_token" TEXT,
ADD COLUMN     "invite_token_expires_at" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "staff_email_key" ON "staff"("email");

-- CreateIndex
CREATE UNIQUE INDEX "staff_invite_token_key" ON "staff"("invite_token");

-- CreateTable
CREATE TABLE "staff_attendance_settings" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "check_in_time" TEXT NOT NULL,
    "grace_period_minutes" INTEGER NOT NULL DEFAULT 15,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "staff_attendance_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "staff_attendance_settings_organization_id_key" ON "staff_attendance_settings"("organization_id");

-- CreateTable
CREATE TABLE "staff_attendance_records" (
    "id" UUID NOT NULL,
    "staff_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "check_in_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "staff_attendance_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "staff_attendance_records_date_idx" ON "staff_attendance_records"("date");

-- CreateIndex
CREATE UNIQUE INDEX "staff_attendance_records_staff_id_date_key" ON "staff_attendance_records"("staff_id", "date");

-- AddForeignKey
ALTER TABLE "staff_attendance_settings" ADD CONSTRAINT "staff_attendance_settings_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_attendance_records" ADD CONSTRAINT "staff_attendance_records_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;
