export type AttendanceStatus = 'ATTENDED' | 'NOT_ATTENDED' | 'ATTENDED_NO_ROUTINE';

export interface Attendance {
    id: number;
    clientId: number;
    clientName: string;
    date: string;
    time: string;
    status: AttendanceStatus;
    completed: boolean;
    observations: string;
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
