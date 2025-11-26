export interface Session {
    id: number;
    routineId: number;
    routineName: string;
    startDate: string;
    startTime: string;
    notes: string | null;
}

export interface CreateSessionRequest {
    routineId: number;
    startDate: string;
    startTime: string;
    notes?: string;
}

export interface UpdateSessionRequest {
    id: number;
    scheduledDate?: string;
    scheduledTime?: string;
    completed?: boolean;
    notes?: string;
}

export interface SessionsListResponse {
    data: Session[];
    count: number;
    message: string;
}

export interface SessionResponse {
    data: Session;
    message: string;
}

// API response format (raw from backend if different)
export interface SessionApiResponse {
    id: number;
    routineId: number;
    dateTime: string;
    completed: boolean;
    notes: string | null;
}
