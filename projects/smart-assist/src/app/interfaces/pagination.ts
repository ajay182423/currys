export interface IPagination{
    currentpage: number;
    itemsPerPage: number;
    totalItems:number;
    totalPages:number;
}

export class PaginatedResults<T>{
    result: T | undefined;
    pagination: IPagination | undefined;
}