export interface IAuditParameter{
  maxScore: any;
  id: number,
  sectionId: number,
  parameter: string,
  parentParameterId: number,
  helpText: string,
  isActive: boolean,
  createdOn: Date,
  updatedBy: string,
  updatedOn: Date,
}
