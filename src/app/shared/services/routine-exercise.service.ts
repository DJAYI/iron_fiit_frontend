import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
    RoutineExercise,
    RoutineExercisesListResponse,
    RoutineExerciseResponse,
    CreateRoutineExerciseRequest,
    UpdateRoutineExerciseRequest,
} from '../interfaces/training.interface';

@Injectable({
    providedIn: 'root',
})
export class RoutineExerciseService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = environment.apiUrl;
    private readonly API_URL = `${this.apiUrl}/api/routine-exercises`;

    getRoutineExercises(routineId: number): Observable<RoutineExercisesListResponse> {
        return this.http.get<RoutineExercisesListResponse>(`${this.API_URL}/routine/${routineId}`, {
            withCredentials: true
        });
    }

    getRoutineExercise(id: number): Observable<RoutineExerciseResponse> {
        return this.http.get<RoutineExerciseResponse>(`${this.API_URL}/${id}`, {
            withCredentials: true
        });
    }

    createRoutineExercise(request: CreateRoutineExerciseRequest): Observable<RoutineExerciseResponse> {
        return this.http.post<RoutineExerciseResponse>(this.API_URL, request, {
            withCredentials: true
        });
    }

    updateRoutineExercise(request: UpdateRoutineExerciseRequest): Observable<RoutineExerciseResponse> {
        return this.http.put<RoutineExerciseResponse>(`${this.API_URL}/${request.id}`, request, {
            withCredentials: true
        });
    }

    deleteRoutineExercise(id: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.API_URL}/${id}`, {
            withCredentials: true
        });
    }
}
