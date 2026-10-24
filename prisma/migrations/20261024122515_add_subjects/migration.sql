-- CreateTable
CREATE TABLE "subjects" (
    "id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class_subjects" (
    "id" UUID NOT NULL,
    "class_id" UUID NOT NULL,
    "subject_id" UUID NOT NULL,
    "subject_teacher_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "class_subjects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subjects_school_id_name_key" ON "subjects"("school_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "class_subjects_class_id_subject_id_key" ON "class_subjects"("class_id", "subject_id");

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_subjects" ADD CONSTRAINT "class_subjects_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_subjects" ADD CONSTRAINT "class_subjects_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_subjects" ADD CONSTRAINT "class_subjects_subject_teacher_id_fkey" FOREIGN KEY ("subject_teacher_id") REFERENCES "staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- DropIndex (replacing the free-text "subject" uniqueness with one on subject_id)
DROP INDEX "exam_scores_pupil_id_subject_term_session_key";

-- AlterTable (exam_scores is empty — no data to migrate)
ALTER TABLE "exam_scores" DROP COLUMN "subject";
ALTER TABLE "exam_scores" ADD COLUMN "subject_id" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "exam_scores_pupil_id_subject_id_term_session_key" ON "exam_scores"("pupil_id", "subject_id", "term", "session");

-- AddForeignKey
ALTER TABLE "exam_scores" ADD CONSTRAINT "exam_scores_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
