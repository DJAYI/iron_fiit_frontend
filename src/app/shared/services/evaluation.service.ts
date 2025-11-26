import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse, PhysicalEvaluation, CreatePhysicalEvaluationRequest, UpdatePhysicalEvaluationRequest } from '../interfaces';

@Injectable({
    providedIn: 'root'
})
export class EvaluationService {
    private api = inject(ApiService);

    // Get current user's evaluations (client)
    getMyEvaluations(): Observable<ApiResponse<PhysicalEvaluation[]>> {
        return this.api.get<ApiResponse<PhysicalEvaluation[]>>('/api/clients/me/evaluations');
    }

    // Get all evaluations
    getAllEvaluations(): Observable<ApiResponse<PhysicalEvaluation[]>> {
        return this.api.get<ApiResponse<PhysicalEvaluation[]>>('/api/physical-evaluations');
    }

    // Get evaluation by ID
    getEvaluationById(id: number): Observable<ApiResponse<PhysicalEvaluation>> {
        return this.api.get<ApiResponse<PhysicalEvaluation>>(`/api/physical-evaluations/${id}`);
    }

    // Get evaluations by client ID
    getClientEvaluations(clientId: number): Observable<ApiResponse<PhysicalEvaluation[]>> {
        return this.api.get<ApiResponse<PhysicalEvaluation[]>>(`/api/physical-evaluations/client/${clientId}`);
    }

    // Get evaluations by trainer ID
    getTrainerEvaluations(trainerId: number): Observable<ApiResponse<PhysicalEvaluation[]>> {
        return this.api.get<ApiResponse<PhysicalEvaluation[]>>(`/api/physical-evaluations/trainer/${trainerId}`);
    }

    // Create new evaluation
    createEvaluation(data: CreatePhysicalEvaluationRequest): Observable<ApiResponse<PhysicalEvaluation>> {
        return this.api.post<ApiResponse<PhysicalEvaluation>>('/api/physical-evaluations', data);
    }

    // Update evaluation
    updateEvaluation(id: number, data: UpdatePhysicalEvaluationRequest): Observable<ApiResponse<PhysicalEvaluation>> {
        return this.api.put<ApiResponse<PhysicalEvaluation>>(`/api/physical-evaluations/${id}`, data);
    }
}
