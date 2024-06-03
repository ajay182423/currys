export interface IEmailList{
    id:number,
    isChecked:boolean,
    conversationId:string,
    mailSubject:string,
    creationTime:Date,
    mailRecievedTime:Date,
    mailFrom:string,
    mailCC:string,
    attachment:boolean,
    tat:string,
    assignedOn:Date,
    isAssignToTeam:boolean,
    assignToTeamId:number,
    completedOn:Date,
    userId:string,
    classificationId:string,
    mailBoxId:string,
    statusId:string,
    sentiment:string,
}

export interface Priority{
    priorityFlag:number
}