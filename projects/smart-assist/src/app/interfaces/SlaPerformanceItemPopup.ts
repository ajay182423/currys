export interface SlaPerformancePopup{
    id:number,
    conversationId:string,
    mailSubject:string,
    mailRecievedTime:Date,
    completedOn:Date,
    classificationName: string;
    status: string;
    sender: string;
    assignedTo: string;
}