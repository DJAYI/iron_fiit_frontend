import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse, Exercise, Category, MuscleGroup, CreateExerciseRequest, UpdateExerciseRequest, CreateCategoryRequest, UpdateCategoryRequest, CreateMuscleGroupRequest, UpdateMuscleGroupRequest, ExercisesListResponse, ExerciseResponse, CategoriesListResponse, CategoryResponse, MuscleGroupsListResponse, MuscleGroupResponse } from '../interfaces';

@Injectable({
    providedIn: 'root'
})
export class CatalogService {
    private api = inject(ApiService);

    // EXERCISE endpoints
    getAllExercises(): Observable<ExercisesListResponse> {
        return this.api.get<ExercisesListResponse>('/api/exercises');
    }

    getExercise(id: number): Observable<ExerciseResponse> {
        return this.api.get<ExerciseResponse>(`/api/exercises/${id}`);
    }

    createExercise(data: CreateExerciseRequest): Observable<ExerciseResponse> {
        return this.api.post<ExerciseResponse>('/api/exercises', data);
    }

    updateExercise(id: number, data: UpdateExerciseRequest): Observable<ExerciseResponse> {
        return this.api.put<ExerciseResponse>('/api/exercises', { ...data, id });
    }

    deleteExercise(id: number): Observable<ApiResponse<any>> {
        return this.api.delete<ApiResponse<any>>(`/api/exercises/${id}`);
    }

    // CATEGORY endpoints
    getAllCategories(): Observable<CategoriesListResponse> {
        return this.api.get<CategoriesListResponse>('/api/categories');
    }

    getCategory(id: number): Observable<CategoryResponse> {
        return this.api.get<CategoryResponse>(`/api/categories/${id}`);
    }

    createCategory(data: CreateCategoryRequest): Observable<CategoryResponse> {
        return this.api.post<CategoryResponse>('/api/categories', data);
    }

    updateCategory(id: number, data: UpdateCategoryRequest): Observable<CategoryResponse> {
        return this.api.put<CategoryResponse>(`/api/categories/${id}`, data);
    }

    deleteCategory(id: number): Observable<ApiResponse<any>> {
        return this.api.delete<ApiResponse<any>>(`/api/categories/${id}`);
    }

    // MUSCULAR GROUP endpoints
    getAllMuscleGroups(): Observable<MuscleGroupsListResponse> {
        return this.api.get<MuscleGroupsListResponse>('/api/muscular-groups');
    }

    getMuscleGroup(id: number): Observable<MuscleGroupResponse> {
        return this.api.get<MuscleGroupResponse>(`/api/muscular-groups/${id}`);
    }

    createMuscleGroup(data: CreateMuscleGroupRequest): Observable<MuscleGroupResponse> {
        return this.api.post<MuscleGroupResponse>('/api/muscular-groups', data);
    }

    updateMuscleGroup(id: number, data: UpdateMuscleGroupRequest): Observable<MuscleGroupResponse> {
        return this.api.put<MuscleGroupResponse>(`/api/muscular-groups/${id}`, data);
    }

    deleteMuscleGroup(id: number): Observable<ApiResponse<any>> {
        return this.api.delete<ApiResponse<any>>(`/api/muscular-groups/${id}`);
    }
}
