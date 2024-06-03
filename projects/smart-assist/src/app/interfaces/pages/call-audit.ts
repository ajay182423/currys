import { ICallAuditSection } from "./call-audit-section";

export interface ICallAudit{
  sectionId: number,
  section: string,
  weightage: number,
  parameter: string,
  parentParameterId: number,
  helpText: string,
  transactionId: string,
  qa: string,
  score: number,
  confidence: number,
  status: string,
  fatal: string,
  // others: string,
  auditResult: string
}

export interface IAudioCallAudit{
  input_transaction_id?:string,
  bucket?: string,
  input_file_path?: string,
  transcript_ID?: string
}

export interface IPostCallAudit{
  processId: number;
  formId: number;
  assignedTo: string;
  qa: string;
  transactionId:string;
  sections: ICallAuditSection[]
}

export interface IGetTranscript {
  input_transaction_id: string;
  bucket: string;
  input_file_path: string;
}
