export interface IUser {
    id?: any | null;
    username?: string | null;
    email?: string;
    password?: string;
    roles?: string[];
}

export interface IAuthUser {
    id: number;
    username: string;
    email: string;
    roles: string[];
    token: string;
}
