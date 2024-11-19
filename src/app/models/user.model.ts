export enum UserRole {
    Client = 'client',
    Service = 'service',
}

export interface User {
    uid: string;
    email: string;
    password?: string;
    name: string;
    role: UserRole;
}
