export interface AuthUserCredentials {
    username: string;
    password: string;
}

export interface LoginResponse {
    token?: string;
    role?: string;
    username?: string;
    error?: string;
}