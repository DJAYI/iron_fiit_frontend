export interface DashboardStats {
    totalClients: number;
    totalTrainers: number;
    activePlans: number;
    weeklyAttendance: number;
    calculatedAt: string;
}

export interface ComplianceReport {
    clientId: number;
    clientName: string;
    totalAttendances: number;
    completedSessions: number;
    programmedSessions: number;
    completionPercentage: number;
    hasActivePlan: boolean;
    activePlanId?: number;
    activePlanName?: string;
}

export interface ExerciseComplianceReport {
    planId: number;
    planName: string;
    clientId: number;
    clientName: string;
    totalExercises: number;
    completedExercises: number;
    completionPercentage: number;
    routineCount: number;
}
