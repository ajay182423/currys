import { ICallAuditResults } from "./call-audit-results";

export interface ICallAuditSection{
  sectionId: number;
  section: string;
  weightage: number;
  results: ICallAuditResults[]
}


