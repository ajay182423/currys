export interface IFileInfoAndContent {
    id: number,
    name: string,
    location: string[],
    updatedBy: string,
    lastWriteTime: Date,
    content: string
}

export interface IFolderFileSetup {
    action: string,
    name: string,
    location: string,
    updatedBy: string,
} 
