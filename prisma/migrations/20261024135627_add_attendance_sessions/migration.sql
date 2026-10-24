-- DropForeignKey
ALTER TABLE "attendance_records" DROP CONSTRAINT "attendance_records_pupil_id_fkey";
ALTER TABLE "attendance_records" DROP CONSTRAINT "attendance_records_class_id_fkey";

-- DropTable (empty — no data to migrate; replaced by attendance_sessions + a reshaped attendance_records)
DROP TABLE "attendance_records";

-- CreateTable
CREATE TABLE "attendance_sessions" (
    "id" UUID NOT NULL,
    "class_id" UUID NOT NULL,
    "subject_id" UUID,
    "activity" TEXT,
    "date" DATE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendance_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance_records" (
    "id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "pupil_id" UUID NOT NULL,
    "status" "attendance_status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendance_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "attendance_sessions_class_id_date_idx" ON "attendance_sessions"("class_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_records_session_id_pupil_id_key" ON "attendance_records"("session_id", "pupil_id");

-- AddForeignKey
ALTER TABLE "attendance_sessions" ADD CONSTRAINT "attendance_sessions_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_sessions" ADD CONSTRAINT "attendance_sessions_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "attendance_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_pupil_id_fkey" FOREIGN KEY ("pupil_id") REFERENCES "pupils"("id") ON DELETE CASCADE ON UPDATE CASCADE;
