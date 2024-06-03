export interface IGraphMailReply{
    content:string,
    toRecipients:IMailReplyAddress[],
    ccRecipients:IMailReplyAddress[]
}

export interface IMailReplyAddress{
    address:string
}
