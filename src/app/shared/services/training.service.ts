import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse, TrainingPlan, Routine, Exercise, CreateTrainingPlanRequest, CreateRoutineRequest, CreateExerciseRequest } from '../interfaces';

@Injectable({
    providedIn: 'root'
})
export class TrainingService {
    private api = inject(ApiService);

    // Training Plans
    getAllTrainingPlans(): Observable<ApiResponse<TrainingPlan[]>> {
        return this.api.get<ApiResponse<TrainingPlan[]>>('/api/training-plans');
    }

    getMyTrainingPlans(): Observable<ApiResponse<TrainingPlan[]>> {
        return this.api.get<ApiResponse<TrainingPlan[]>>('/api/trainers/me/training-plans');
    }

    getMyActiveTrainingPlan(): Observable<ApiResponse<TrainingPlan>> {
        return this.api.get<ApiResponse<TrainingPlan>>('/api/clients/me/training-plan');
    }

    createTrainingPlan(data: CreateTrainingPlanRequest): Observable<ApiResponse<TrainingPlan>> {
        return this.api.post<ApiResponse<TrainingPlan>>('/api/training-plans', data);
    }

    // Routines
    getRoutinesByPlan(planId: number): Observable<ApiResponse<Routine[]>> {
        return this.api.get<ApiResponse<Routine[]>>(`/api/routines?trainmentPlanId=${planId}`);
    }

    getMyRoutines(): Observable<ApiResponse<Routine[]>> {
        return this.api.get<ApiResponse<Routine[]>>('/api/clients/me/routines');
    }

    getTrainerRoutines(): Observable<ApiResponse<Routine[]>> {
        return this.api.get<ApiResponse<Routine[]>>('/api/trainers/me/routines');
    }

    createRoutine(data: CreateRoutineRequest): Observable<ApiResponse<Routine>> {
        return this.api.post<ApiResponse<Routine>>('/api/routines', data);
    }

    // Exercises
    getAllExercises(): Observable<ApiResponse<Exercise[]>> {
        return this.api.get<ApiResponse<Exercise[]>>('/api/exercises');
    }

    createExercise(data: CreateExerciseRequest): Observable<ApiResponse<Exercise>> {
        return this.api.post<ApiResponse<Exercise>>('/api/exercises', data);
    }
}
