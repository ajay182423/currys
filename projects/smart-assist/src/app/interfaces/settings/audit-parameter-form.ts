export interface IAuditParameterForm{
  id: number,
  formId: number,
  processId: string,
  qa: string,
  auditParameterId: number,
  assignedTo: string,
  isActive: boolean,
  createdDate: Date,
  updatedBy: string,
  updatedOn: Date,
  maxScore:number
}

export interface IAuditParameterFormPost{
  formId: number,
  processId: string,
  qa: string,
  assignedTo: string,
  parameter: [
    {
      auditParameterId: number,
      maxScore: number,
      isActive: boolean,
    }
  ]
  updatedBy: string,
  updatedOn: Date,
}
export interface IAuditParameterFormPut{
  formId: number,
  processId: string,
  qa: string,
  assignedTo: string,
  parameter: [
    {
      id: number,
      auditParameterId: number,
      maxScore: number,
      isActive: boolean,
    }
  ]
  updatedBy: string,
  updatedOn: Date,
}
