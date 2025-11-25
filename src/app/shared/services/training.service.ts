import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
    TrainingPlan,
    Routine,
    CreateTrainingPlanRequest,
    UpdateTrainingPlanRequest,
    CreateRoutineRequest,
    UpdateRoutineRequest,
    TrainingPlansListResponse,
    TrainingPlanResponse,
    RoutinesListResponse,
    RoutineResponse,
    ObjectivesListResponse,
    StatesListResponse
} from '../interfaces';

@Injectable({
    providedIn: 'root'
})
export class TrainingService {
    private api = inject(ApiService);

    // Training Plans
    getAllTrainingPlans(): Observable<TrainingPlansListResponse> {
        return this.api.get<TrainingPlansListResponse>('/api/training-plans');
    }

    getTrainingPlan(id: number): Observable<TrainingPlanResponse> {
        return this.api.get<TrainingPlanResponse>(`/api/training-plans/${id}`);
    }

    getTrainingPlansByClient(clientId: number): Observable<TrainingPlansListResponse> {
        return this.api.get<TrainingPlansListResponse>(`/api/training-plans/client/${clientId}`);
    }

    getTrainingPlansByTrainer(trainerId: number): Observable<TrainingPlansListResponse> {
        return this.api.get<TrainingPlansListResponse>(`/api/training-plans/trainer/${trainerId}`);
    }

    createTrainingPlan(data: CreateTrainingPlanRequest): Observable<TrainingPlanResponse> {
        return this.api.post<TrainingPlanResponse>('/api/training-plans', data);
    }

    updateTrainingPlan(data: UpdateTrainingPlanRequest): Observable<TrainingPlanResponse> {
        return this.api.put<TrainingPlanResponse>('/api/training-plans', data);
    }

    // Client-specific methods
    getMyActiveTrainingPlan(): Observable<TrainingPlanResponse> {
        return this.api.get<TrainingPlanResponse>('/api/clients/me/training-plan');
    }

    getMyRoutines(): Observable<RoutinesListResponse> {
        return this.api.get<RoutinesListResponse>('/api/clients/me/routines');
    }

    // Trainer-specific methods
    getMyTrainingPlans(): Observable<TrainingPlansListResponse> {
        return this.api.get<TrainingPlansListResponse>('/api/trainers/me/training-plans');
    }

    getTrainerRoutines(): Observable<RoutinesListResponse> {
        return this.api.get<RoutinesListResponse>('/api/trainers/me/routines');
    }

    // Routines
    getAllRoutines(): Observable<RoutinesListResponse> {
        return this.api.get<RoutinesListResponse>('/api/routines');
    }

    getRoutine(id: number): Observable<RoutineResponse> {
        return this.api.get<RoutineResponse>(`/api/routines/${id}`);
    }

    getRoutinesByTrainingPlan(trainmentPlanId: number): Observable<RoutinesListResponse> {
        return this.api.get<RoutinesListResponse>(`/api/routines/training-plan/${trainmentPlanId}`);
    }

    createRoutine(data: CreateRoutineRequest): Observable<RoutineResponse> {
        return this.api.post<RoutineResponse>('/api/routines', data);
    }

    updateRoutine(data: UpdateRoutineRequest): Observable<RoutineResponse> {
        return this.api.put<RoutineResponse>('/api/routines', data);
    }

    // Objectives and States
    getAllObjectives(): Observable<ObjectivesListResponse> {
        return this.api.get<ObjectivesListResponse>('/api/trainment-plan/objectives');
    }

    getAllStates(): Observable<StatesListResponse> {
        return this.api.get<StatesListResponse>('/api/trainment-plan/states');
    }
}
