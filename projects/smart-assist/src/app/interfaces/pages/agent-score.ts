export interface IAgentScore{
  agentName: any;
  id: number,
  agentId: number,
  transactionId: string,
  callDuration: string,
  quality: string,
  flag: string,
  status: string,
  callDate: Date,
  auditedDate: Date,
}
export interface IbackOffice{
  id: number,
  agentId: number,
  agentName: string,
  transactionId: string,
  callDuration: string,
  quality: string,
  flag: string,
  status: string,
  createdOn: Date,
  updatedOn: Date,
}
