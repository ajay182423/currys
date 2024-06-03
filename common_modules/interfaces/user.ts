export interface IUser {
    appRole: string,
    pappId: number,
    userName: string,
    firstName: string,
    lastName: string,
    roleName: string,
    token: string,
    refreshToken: string,
    refreshTokenExpires: Date,
    userRole: string[],
    loginType: string,
    custId:string
}
