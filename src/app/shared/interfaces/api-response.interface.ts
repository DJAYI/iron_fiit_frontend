export interface ApiResponse<T = any> {
    message: string;
    data?: T;
    error?: boolean;
    count?: number;
}
