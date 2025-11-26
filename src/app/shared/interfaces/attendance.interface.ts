export type AttendanceStatus = 'ATTENDED' | 'NOT_ATTENDED' | 'ATTENDED_NO_ROUTINE';

export interface Attendance {
    id: number;
    clientId: number;
    dateTime: string;
    status: AttendanceStatus;
    completed: boolean;
    observations: string | null;
    sessionId: number | null;
}

export interface AttendanceListResponse {
    attendances: Attendance[];
    message: string;
}

export interface AttendanceResponse {
    attendance: Attendance;
    message: string;
}

export interface RegisterAttendanceRequest {
    status: AttendanceStatus;
    observations?: string;
}

export interface MarkCompletedRequest {
    attendanceId: number;
    completed: boolean;
}

export interface ClientCompliance {
    clientId: number;
    clientName: string;
    totalAttendances: number;
    attendedCount: number;
    notAttendedCount: number;
    attendancePercentage: number;
    programmedSessions: number;
    completedSessions: number;
    hasActivePlan: boolean;
    activePlanId?: number;
    activePlanName?: string;
}
