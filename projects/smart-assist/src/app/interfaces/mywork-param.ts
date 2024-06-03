import { IEmailList } from "./email-param";

export interface IMyWorkList{
    id:number,
    userName:string,
    isActive:boolean,
    updatedBy:string,
    updatedOn:Date,
    teamName:string,
    mailData:IEmailList[]
}