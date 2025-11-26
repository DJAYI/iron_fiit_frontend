export interface PhysicalEvaluation {
    id: number;
    clientId: number;
    clientName: string;
    trainerId: number;
    trainerName: string;
    evaluationDate: string;
    weight: number;
    bmi: number;
    bodyFatPercentage: number;
    waistMeasurement: number;
    hipMeasurement: number;
    heightMeasurement: number;
    notes: string | null;
}

export interface CreatePhysicalEvaluationRequest {
    clientId: number;
    trainerId: number;
    evaluationDate: string;
    weight: number;
    bmi: number;
    bodyFatPercentage: number;
    waistMeasurement: number;
    hipMeasurement: number;
    heightMeasurement: number;
    notes?: string;
}

export interface UpdatePhysicalEvaluationRequest {
    clientId?: number;
    trainerId?: number;
    evaluationDate?: string;
    weight?: number;
    bmi?: number;
    bodyFatPercentage?: number;
    waistMeasurement?: number;
    hipMeasurement?: number;
    heightMeasurement?: number;
    notes?: string;
}
