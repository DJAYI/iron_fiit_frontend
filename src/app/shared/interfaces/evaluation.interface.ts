export interface PhysicalEvaluation {
    id: number;
    evaluationDate: string;
    weight: number;
    bmi: number;
    bodyFatPercentage: number;
    muscleMass: number;
    measurements: string;
    notes: string;
    trainerId: number;
    trainerName: string;
}

export interface CreatePhysicalEvaluationRequest {
    clientId: number;
    trainerId: number;
    evaluationDate: string;
    weight: number;
    bmi: number;
    bodyFatPercentage: number;
    muscleMass: number;
    measurements: string;
    notes: string;
}
