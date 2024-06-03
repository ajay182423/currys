export interface IAuditRecords{
  department: any;
  flag: any;
  callResponse: string;
  queryResolved: string;
  workGroup: string;
  id: number,
  agentId: number,
  transactionId: string,
  fileName: string,
  receivingDate: Date,
  filePath: string,
  transcriptId: string,
  pathJson: string,
  pathCsv: string,
  status: string,
  transactionType: string,
  createdOn: Date,
  callDetails: string;
  agentName : string;
}
