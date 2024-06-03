export interface IAuditSceeen{
  auditId: number,
  formId: number,
  qaId: number,
  auditParameterId: number,
  status: number,
  confidancePercentage: number,
  fatalOrNot: string,
  weightsPercentage: number,
  descriptions: string,
  isActive: boolean,
  createdOn: Date,
  updatedBy: string,
  updatedOn: Date
}
