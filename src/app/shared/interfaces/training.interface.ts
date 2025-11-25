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

export interface UpdateTrainingPlanRequest {
    id: number;
    name?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    clientId?: number;
    trainerId?: number;
    objectiveId?: number;
    stateId?: number;
}

export interface TrainingPlansListResponse {
    data: TrainingPlan[];
    message: string;
}

export interface TrainingPlanResponse {
    data: TrainingPlan;
    message: string;
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

export interface UpdateRoutineRequest {
    id: number;
    name?: string;
    description?: string;
    trainmentPlanId?: number;
}

export interface RoutinesListResponse {
    data: Routine[];
    message: string;
}

export interface RoutineResponse {
    data: Routine;
    message: string;
}

export interface TrainingPlanObjective {
    id: number;
    name: string;
    description: string;
}

export interface TrainingPlanState {
    id: number;
    name: string;
    description: string;
}

export interface ObjectivesListResponse {
    trainmentObjectives: TrainingPlanObjective[];
    message: string;
}

export interface StatesListResponse {
    trainmentStates: TrainingPlanState[];
    message: string;
}
