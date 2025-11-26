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
}

export interface CreateObjectiveRequest {
    name: string;
}

export interface UpdateObjectiveRequest {
    id: number;
    name: string;
}

export interface TrainingPlanState {
    id: number;
    name: string;
}

export interface CreateStateRequest {
    name: string;
}

export interface UpdateStateRequest {
    id: number;
    name: string;
}

export interface ObjectivesListResponse {
    trainmentObjectives: TrainingPlanObjective[];
    message: string;
}

export interface ObjectiveResponse {
    trainmentObjective: TrainingPlanObjective;
    message: string;
}

export interface StatesListResponse {
    trainmentObjectives: TrainingPlanState[];
    message: string;
}

export interface StateResponse {
    trainmentState: TrainingPlanState;
    message: string;
}

export interface RoutineExercise {
    id: number;
    routineId: number;
    routineName: string;
    exerciseId: number;
    exerciseName: string;
    order: number;
    sets: number;
    reps: number;
    timeSeconds: number | null;
    restSeconds: number;
    targetWeight: number | null;
}

export interface CreateRoutineExerciseRequest {
    routineId: number;
    exerciseId: number;
    order: number;
    sets: number;
    reps: number;
    timeSeconds?: number | null;
    restSeconds: number;
    targetWeight?: number | null;
}

export interface UpdateRoutineExerciseRequest {
    id: number;
    order?: number;
    sets?: number;
    reps?: number;
    timeSeconds?: number | null;
    restSeconds?: number;
    targetWeight?: number | null;
}

export interface RoutineExercisesListResponse {
    data: RoutineExercise[];
    message: string;
}

export interface RoutineExerciseResponse {
    data: RoutineExercise;
    message: string;
}
