export interface IBusinessRulesStore {
      id: 0,
      slaType: string,
      name: string,
      slaThreshold: number,
      dataSource: string,
      dataSource2: string,
      slaValue: string,
      tableSourceLHS: string,
      tableSourceRHS: string,
      sumColumnLHS:string,
      sumColumnRHS: string,
      ruleExpression: string,
      isActive: boolean,
      updatedBy: string,
      updatedOn: Date,
      createdBy: string,
      createdOn: Date   
}