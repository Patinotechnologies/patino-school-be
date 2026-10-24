-- CreateEnum
CREATE TYPE "guardian_relationship" AS ENUM ('mother', 'father', 'guardian');

-- CreateEnum
CREATE TYPE "attendance_status" AS ENUM ('present', 'absent', 'late');

-- CreateEnum
CREATE TYPE "term" AS ENUM ('first', 'second', 'third');

-- CreateEnum
CREATE TYPE "fee_invoice_status" AS ENUM ('unpaid', 'partial', 'paid');

-- CreateTable
CREATE TABLE "pupils" (
    "id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "class_id" UUID,
    "full_name" TEXT NOT NULL,
    "date_of_birth" DATE NOT NULL,
    "guardian_name" TEXT NOT NULL,
    "guardian_phone" TEXT NOT NULL,
    "guardian_relationship" "guardian_relationship" NOT NULL,
    "address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pupils_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance_records" (
    "id" UUID NOT NULL,
    "pupil_id" UUID NOT NULL,
    "class_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "status" "attendance_status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendance_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_scores" (
    "id" UUID NOT NULL,
    "pupil_id" UUID NOT NULL,
    "class_id" UUID NOT NULL,
    "subject" TEXT NOT NULL,
    "term" "term" NOT NULL,
    "session" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exam_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fee_structures" (
    "id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "level" "school_level" NOT NULL,
    "term" "term" NOT NULL,
    "session" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fee_structures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fee_invoices" (
    "id" UUID NOT NULL,
    "pupil_id" UUID NOT NULL,
    "class_id" UUID NOT NULL,
    "term" "term" NOT NULL,
    "session" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "amount_paid" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "fee_invoice_status" NOT NULL DEFAULT 'unpaid',
    "due_date" DATE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fee_invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fee_payments" (
    "id" UUID NOT NULL,
    "invoice_id" UUID NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paid_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fee_payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "pupils_school_id_idx" ON "pupils"("school_id");

-- CreateIndex
CREATE INDEX "pupils_class_id_idx" ON "pupils"("class_id");

-- CreateIndex
CREATE INDEX "attendance_records_class_id_date_idx" ON "attendance_records"("class_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_records_pupil_id_date_key" ON "attendance_records"("pupil_id", "date");

-- CreateIndex
CREATE INDEX "exam_scores_class_id_term_session_idx" ON "exam_scores"("class_id", "term", "session");

-- CreateIndex
CREATE UNIQUE INDEX "exam_scores_pupil_id_subject_term_session_key" ON "exam_scores"("pupil_id", "subject", "term", "session");

-- CreateIndex
CREATE UNIQUE INDEX "fee_structures_school_id_level_term_session_key" ON "fee_structures"("school_id", "level", "term", "session");

-- CreateIndex
CREATE INDEX "fee_invoices_class_id_term_session_idx" ON "fee_invoices"("class_id", "term", "session");

-- CreateIndex
CREATE UNIQUE INDEX "fee_invoices_pupil_id_term_session_key" ON "fee_invoices"("pupil_id", "term", "session");

-- CreateIndex
CREATE INDEX "fee_payments_invoice_id_idx" ON "fee_payments"("invoice_id");

-- AddForeignKey
ALTER TABLE "pupils" ADD CONSTRAINT "pupils_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pupils" ADD CONSTRAINT "pupils_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_pupil_id_fkey" FOREIGN KEY ("pupil_id") REFERENCES "pupils"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_scores" ADD CONSTRAINT "exam_scores_pupil_id_fkey" FOREIGN KEY ("pupil_id") REFERENCES "pupils"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_scores" ADD CONSTRAINT "exam_scores_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_structures" ADD CONSTRAINT "fee_structures_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_invoices" ADD CONSTRAINT "fee_invoices_pupil_id_fkey" FOREIGN KEY ("pupil_id") REFERENCES "pupils"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_invoices" ADD CONSTRAINT "fee_invoices_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_payments" ADD CONSTRAINT "fee_payments_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "fee_invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;
