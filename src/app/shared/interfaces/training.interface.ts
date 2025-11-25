export interface TrainingPlan {
    id: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    clientId: number;
    clientName: string;
    trainerId: number;
    trainerName: string;
    objectiveId: number;
    objectiveName: string;
    stateId: number;
    stateName: string;
}

export interface CreateTrainingPlanRequest {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    clientId: number;
    trainerId: number;
    objectiveId: number;
    stateId: number;
}

export interface Routine {
    id: number;
    name: string;
    description: string;
    trainmentPlanId: number;
    trainmentPlanName: string;
}

export interface CreateRoutineRequest {
    name: string;
    description: string;
    trainmentPlanId: number;
}
