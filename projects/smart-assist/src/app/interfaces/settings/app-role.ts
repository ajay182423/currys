export interface IAppRole { 
    id: number,
    name: string,
    hierarchyNo: number,
    description: string,
    isActive: boolean,
    updatedBy: string,
    updatedOn: Date,
    totalUsers: number,
    totalAccesses: number,
    specialAccessIds: number[]
}

export interface IAppRoleSpecialAccess { 
    id: number,
    uniqueName: string,
    uiName: string,
    isAccessOn: boolean,
} 