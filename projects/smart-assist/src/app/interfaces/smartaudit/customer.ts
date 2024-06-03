export interface ICustomer { 
    id: number,
    customerName: string,
    normalizedEmail: string,
    emailConfirmed: boolean,
    phoneNumber: string,
    phoneNumberConfirmed:boolean,
    isActive: boolean,
    createdOn: Date,
    updatedBy: string,
    updatedOn: Date,
}