export interface IGraphMessage{
    isRead:boolean,
    id:number,
    sender:IMailAddress,
    subject:string,
    createdDateTime:Date,
    receivedDateTime:Date,
    bodyPreview:string,
    hasAttachments:boolean,
    conversationId:string,
    body:IMailBody,
    from:string,
    toRecipients:IMailAddress[],
    ccRecipients:IMailAddress[]
}

export interface IMailAddress{
    emailAddress:{
        address:string,

    }
}

export interface IMailBody{
    content:string,
    contentType:string
}