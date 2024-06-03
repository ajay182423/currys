import { IMultiSelectDropDown } from "common_modules/interfaces/multi-select-drop-down";

export interface IAppUser { 
    id: number,
    userName: string,
    firstName: string,
    lastName: string,
    email: string,
    isActive: boolean,
    updatedBy: string,
    updatedOn: Date,
    lastLoggedInOn:Date,
    appRoleList: IMultiSelectDropDown[],
    userGroupId:number,
}

export interface IAppUsers { 
    id: number,
    userName: string,
    firstName: string,
    lastName: string,
    status: string,
    lastLoggedInOn: Date,
    isActive: boolean,
    userGroupName: string,
    appRoleNames: string[],
}

export interface IAppUserUpdate { 
    userName:string,
    appRoleList: IMultiSelectDropDown[]
    userGroupId:number,
    updatedBy:string,
    updatedOn:Date, 
}