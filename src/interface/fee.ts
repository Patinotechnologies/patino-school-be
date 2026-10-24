import type { Term } from "./academic";
import type { SchoolLevel } from "./school";

export type FeeInvoiceStatus = "unpaid" | "partial" | "paid";

export interface CreateFeeStructureRequest {
  schoolId: string;
  level: SchoolLevel;
  term: Term;
  session: string;
  amount: number;
}

export interface FeeStructureResponse {
  id: string;
  schoolId: string;
  level: SchoolLevel;
  term: Term;
  session: string;
  amount: number;
}

export interface CreateFeeInvoiceRequest {
  pupilId: string;
  classId: string;
  term: Term;
  session: string;
  amount: number;
  dueDate?: string | null;
}

export interface RecordFeePaymentRequest {
  amount: number;
}

export interface FeePaymentResponse {
  id: string;
  invoiceId: string;
  amount: number;
  paidAt: string;
}

export interface FeeInvoiceResponse {
  id: string;
  pupilId: string;
  classId: string;
  term: Term;
  session: string;
  amount: number;
  amountPaid: number;
  status: FeeInvoiceStatus;
  dueDate: string | null;
  payments: FeePaymentResponse[];
}

export interface ListFeeInvoicesQuery {
  schoolId: string;
  classId?: string;
  term?: Term;
  session?: string;
  status?: FeeInvoiceStatus;
  page: number;
  pageSize: number;
}
