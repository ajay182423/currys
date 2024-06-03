export interface IAuditScreen{
  processId: number,
  formId: number,
  assignedTo: string,
  auditParameterAndResults: IAuditParameterAndResult[]
}

export interface IAuditParameterAndResult{
  auditParameterId: number,
  sectionId: number,
  section: string,
  weightAge: number,
  parameter: string,
  parentParameterId: number,
  helpText: string,
  transactionId: string
  qa: string,
  score: number,
  confidence: number,
  status: string,
  fatal: string,
  others: any,
  auditResult: string
}